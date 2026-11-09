# Secure coding guide

Audience: every developer on this project. Read time: 10 minutes.
Basis: OWASP Top 10:2025 (awareness) and OWASP ASVS 5.0.0 (requirements to verify against).

## 1. How we use the two standards

| | OWASP Top 10:2025 | OWASP ASVS 5.0.0 |
|---|---|---|
| Purpose | Awareness: which risks matter most | Verification: what "secure" concretely means |
| Format | 10 risk categories | About 350 requirements in 17 chapters, 3 levels (L1, L2, L3) |
| Our use | Name and explain each flaw found by our tools | Checklist in pull requests and target level for the app |

**Target level for this project: ASVS Level 1.** Justification: it is a course project with no sensitive personal or payment data. Move to Level 2 if the app ever stores user data. (Adjust this sentence to your real application.)

## 2. Flaws found by our own tools, mapped to the standards

| Flaw we found | Detected by | Top 10:2025 | ASVS 5.0.0 chapter | Rule of thumb |
|---|---|---|---|---|
| Dynamic code execution (`eval`, `new Function`) | ESLint security, SonarQube S1523 | A05 Injection | V1 Encoding and Sanitization | Input selects an action from an allow-list. It never becomes code |
| DOM XSS (`innerHTML`, `document.write`) | Snyk Code | A05 Injection | V1 Encoding and Sanitization, V3 Web Frontend Security | Render untrusted data as text (`textContent`, React `{value}`) |
| Weak hash (MD5), predictable token (`Math.random`) | SonarQube S4790, S2245 | A04 Cryptographic Failures | V11 Cryptography | Use `crypto.randomBytes` and salted scrypt, argon2 or bcrypt |
| Hardcoded secret (GitHub token) | SonarQube, Snyk, Gitleaks | A07 Authentication Failures (CWE-798) | V13 Configuration | Secrets live in environment variables or a vault. Leaked means revoke first |
| Vulnerable dependencies (Snyk 80, npm audit 38) | Snyk, npm audit, Trivy | A03 Software Supply Chain Failures | V15 Secure Coding and Architecture | Lockfile committed, scan in CI, upgrade critical findings first |

Check the exact category and requirement IDs in the official documents before quoting them in the report. Top 10: https://owasp.org/Top10/2025/ . ASVS: https://owasp.org/www-project-application-security-verification-standard/

## 3. Top 10:2025 in one line each (with a JavaScript/TypeScript tip)

| # | Category | What to remember |
|---|---|---|
| A01 | Broken Access Control (includes SSRF) | Check authorization on the server for every request. Never trust IDs from the client. Validate outbound URLs |
| A02 | Security Misconfiguration | No default credentials, no debug mode in production, set security headers (Next.js `headers()`), pin base images |
| A03 | Software Supply Chain Failures | Commit `package-lock.json`, use `npm ci`, scan dependencies and images in CI, review new packages |
| A04 | Cryptographic Failures | Standard libraries only. TLS everywhere. Never MD5 or SHA-1 for passwords |
| A05 | Injection (SQL, NoSQL, OS command, XSS) | Parameterized queries, schema validation (for example zod), no shell, output encoding |
| A06 | Insecure Design | Think about abuse cases before coding (threat modeling for new features) |
| A07 | Authentication Failures | Use a proven auth library, rate-limit login, no hardcoded credentials |
| A08 | Software or Data Integrity Failures | Verify what you download and deploy, no untrusted deserialization (use `JSON.parse` plus validation) |
| A09 | Security Logging and Alerting Failures | Log security events, never log secrets, and make sure someone is alerted |
| A10 | Mishandling of Exceptional Conditions | Handle errors explicitly, fail closed, never leak stack traces to users |

## 4. Our developer workflow (what protects us, in order)

1. **IDE:** SonarQube for IDE, ESLint security rules and Snyk flag problems while typing.
2. **Commit:** pre-commit hooks (Gitleaks, ESLint security) block secrets and dangerous code.
3. **Pull request:** the security checklist (`.github/pull_request_template.md`) and reviewer attention.
4. **Pipeline:** secrets scan, SAST, dependency scan, image scan, DAST with blocking quality gates.

Hooks can be bypassed with `git commit --no-verify`. The pipeline cannot be bypassed locally. That is why the same checks run in both places.

## 5. When a tool flags something

1. Read the explanation (hover, rule page, Snyk "Fix Analysis").
2. Understand the attack: what input would exploit it?
3. Fix the root cause, not the symptom.
4. Confirm the flag is gone.
5. If it is a real false positive, use the documented exemption process, with a reason, approver and expiry date. Never silence a rule without a written justification.

## 6. Leaked a secret? Do this in order

1. **Revoke or rotate it immediately.** Anything pushed must be treated as compromised.
2. Remove it from the code (environment variable).
3. Clean the Git history only if needed (`git filter-repo`), after revoking.
4. Tell the team and add a detection rule if the scanner missed it.

## 7. Continuous awareness plan

| Activity | Frequency | Time |
|---|---|---|
| Review the findings of the last pipeline runs together | Each sprint or week | 15 min |
| "Flaw of the week": one Top 10 category with an example from our own code | Weekly | 10 min |
| Hands-on lab: OWASP Juice Shop (Node.js and TypeScript), PortSwigger Web Security Academy, Snyk Learn lessons linked from findings | Monthly | 1 h |
| Update this guide when new findings appear or standards change | Each release | 15 min |
| Quiz (see section 8) | At onboarding and each quarter | 10 min |

## 8. Mini quiz (answers at the end)

1. A request parameter is concatenated into an SQL string. Which Top 10:2025 category, and what is the fix?
2. A developer pushed an API token by mistake and deleted it in the next commit. Is the problem solved? What is the first action?
3. Why is `innerHTML = userInput` dangerous, and what is the safe alternative?
4. A pre-commit hook blocks a commit. Why is `--no-verify` still not enough protection against skipping it?
5. Which ASVS level do we target, and why?

**Answers:** (1) A05 Injection, use parameterized queries and input validation. (2) No, the token is still in Git history, so revoke it first. (3) The browser parses the input as HTML and runs attacker script, so use `textContent`. (4) Anyone can bypass local hooks, so the same checks must run in the pipeline, which is enforced on the server. (5) Level 1, because the app handles no sensitive data (adjust to your project).
