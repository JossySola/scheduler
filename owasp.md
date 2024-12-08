# Broken Access Control
## Prevention

+ Except for public resources, **deny access by default**.
+ Implement **access control mechanisms** once and re-use them throughout the application, including minimizing Cross-Origin Resource Sharing (CORS) usage.
+ Model access controls should **enforce record ownership** rather than accepting that the user can create, read, update, or delete any record.
+ Unique application business limit requirement should be enforced by domain models.
+ **Disable web server directory listing** and ensure file metadata (e.g., .git) and backup files are not present within web roots.
+ **Log access control failures**, alert admins when appropriate (e.g., repeated failures).
+ **Rate limit API and controller access** to minimize the harm from automated attack tooling.
+ Stateful **session identifiers should be invalidated** on the server **after logout**. **Stateless JWT tokens should rather be short-lived** so that the window of opportunity for an attacker is minimized. For longer lived JWTs it's highly recommended to follow the OAuth standards to revoke access.

*Include functional access control unit and integration tests.*

# Cryptographic Failure
## Prevention

+ **Classify data** processed, stored, or transmitted by an application. Identify which data is sensitive according to privacy laws, regulatory requirements, or business needs.
+ **Don't store sensitive data unnecessarily**. Discard it as soon as possible or use PCI DSS compliant tokenization or even truncation. Data that is not retained cannot be stolen.
+ Make sure to **encrypt all sensitive data at rest**.
+ **Ensure up-to-date and strong standard algorithms**, protocols, and keys are in place; use proper key management.
+ **Encrypt all data in transit** with secure protocols such as TLS with `forward secrecy (FS) ciphers`, `cipher prioritization` by the server, and `secure parameters`. Enforce encryption using directives like `HTTP Stricts Transport Security (HSTS)`.
+ **Disable caching for response that contain sensitive data**.
+ **Apply required security protocols** as per the data classification.
+ **Do not use legacy protocols** such as FTP and SMTP for transporting sensitive data.
+ **Store passwords using strong** adaptive and salted **`hashing functions` with a `work factor`** (delay factor), such as `Argon2`, `scrypt`, `bcrypt` or `PBKDF2`.
+ **Initialization vectors** must be chosen appropriate for the mode of operation. For many modes, this means using a `CSPRNG` (cryptographically secure pseudo random number generator). For modes that require a `nonce`, then the initialization vector (IV) does not need a `CSPRNG`. **In all cases, the IV should never be used twice for a fixed key**.
+ Always **use authenticated encryption** instead of just encryption.
+ **Keys should be generated cryptographically randomly and stored in memory as byte arrays**. If a password is used, then it must be converted to a key via an appropriate **`password base key derivation function`**.
+ Ensure that cryptographic randomness is used where appropriate, and that it has not been seeded in a predictable way or with low `entropy`. Most modern APIs do not require the developer to seed the `CSPRNG` to get security.
+ **Avoid deprecated cryptographic functions** and `padding schemes`, such as `MD5`, `SHA1`, `PKCS`, number 1 v1.5.
+ Verify independently the effectiveness of configuration and settings.

# Injection
## Prevention

+ The preferred option is to **use a safe API, which avoids using the interpreter entirely, provides a `parameterized interface`, or migrates to Object Relational Mapping Tools (`ORMs`)**.

> Even when parameterized, stored procedures can still introduce SQL injection if `PL/SQL` or `T-SQL` concatenates queries and data or executes hostile data with *EXECUTE IMMEDIATE* or *exec()*.

+ **Use positive server-side input validation**. This is not a complete defense as many applications require special characters, such as text areas or APIs for mobile applications.
+ For any residual dynamic queries, **escape special character** using the specific escape syntax for that interpreter.

> SQL structures such as table names, column names, and so on cannot be escaped, and thus user-supplied structure names are dangerous. This is a common issue in report-writing software.

+ **Use LIMIT and other SQL controls within queries** to prevent mass disclosure of records in case of SQL injection.

# Insecure Design
## Prevention

+ Establish and use **secure development lifecycle** with AppSec professionals to help evaluate and design security and privacy-related controls.
+ Establish and use a **library of secure design patterns** or paved road ready to use components.
+ **Use `threat modeling`** for critical authentication, access control, business logic and key flows.
+ Integrate security language and controls into user stories.
+ Integrate plausibility **checks at each tier of your application** (from frontend to backend).
+ Write **unit and integration tests to validate** that all critical flows are resistant to the `threat model`. Compile use-cases *and* misuse-cases for each tier of your application.
+ **Segregate `tier layers`** on the system and network layers depending on the exposure and protection needs.
+ **Segregate `tenants`** robustly by design throughout all tiers.
+ **Limit resource consumption** by user or service.

# Security Misconfiguration
## Prevention

+ A repeatable hardening process makes it fast and easy to deploy another environment that is appropriately locked down. **Development, QA, and production environments should all be configured identically**, with different credentials used in each environment. This process should be automated to minimize the effort required to set up a new secure environment.
+ A **minimal platform** without any unnecessary features, components, documentation, and samples. **Remove or do not install unused features and frameworks**.
+ A **task to review and update the configurations** appropriate to all security notes, updates, and patches as part of the `patch management process`. Review cloud storage permissions (e.g., `S3 bucket permissions`).
+ A **segmented application architecture** provides effective and secure separation between components or tenants, with `segmentation`, `containerization`, or `cloud security groups` (*ACLs*).
+ Sending **security directives to clients**, e.g., *Security Headers*.
+ An automated process to **verify the effectiveness of the configurations and settings in all environments**.

# Vulnerable and Outdated Components
## Prevention

+ Remove unused dependencies, unnecessary features, components, files, and documentation.
+ Continuously **inventory the versions of both client-side and server-side components** (*e.g., frameworks, libraries*) and their dependencies using tools like versions, `OWASP Dependency Check`, `retire.js`, etc. Continuously monitor sources like `Common Vulnerability and Exposures` (*CVE*) and `National Vulnerability Database` (*NVD*) for vulnerabilities in the components. Use software composition analysis tools to automate the process. Subscribe to email alerts for security vulnerabilities related to components you use.
+ Only obtain components from official sources over secure links. Prefer signed packages to reduce the change of including a modifies, malicious component.
+ Monitor for libraries and components that are unmaintained or do not create security patches for older versions. If patching is not possible, consider deploying a virtual patch to monitor, detect or protect against the discovered issue.

# Identification and Authentication Failures
## Prevention

+ Where possible, **implement multi-factor authentication** to prevent automated `credential stuffing`, `brute force`, and stolen credential reuse attacks.
+ **Do not ship or deploy with any default credentials**, particularly for admin users.
+ **Implement weak password checks**, such as testing new or changed passwords against the top 10,000 worst passwords list.
+ Align password length, complexity, and rotation policies with `National Institute of Standards and Technology` (*NIST*) 800-63b's guidelines in section 5.1.1 for Memorized Secrets or other modern, evidence-based password policies.
+ Ensure registration, credential recovery and API pathways are hardened against `account enumeration attacks` by **using the same messages for all outcomes**.
+ Limit or increasingly **delay failed login attempts**, but be careful **not to create a denial of service scenario**. **Log all failures and alert administrators** when `credential stuffing`, `brute force`, or other attacks are detected.
+ **Use a server-side, secure, built-in session manager** that generates a new random session ID with high `entropy` after login. Session identifier should not be in the URL, be securely stored, and invalidated after logout, idle, and absolute timeouts.

# Software and Data Integrity Failures
## Prevention

+ Use digital signatures or similar mechanisms to **verify the software or data is from the expected source** and has not been altered.
+ Ensure libraries and dependencies, such as **npm** or **Maven**, are consuming trusted repositories. If you have a higher risk profile, consider hosting an internal known-good repository that's vetted.
+ Ensure that a software supply chain security tool, such as `OWASP Dependency Check` or `OWASP CycloneDX`, is used to **verify that components do not contain known vulnerabilities**.
+ Ensure that there is a **review process for code and configuration changes** to minimize the chance that malicious code or configuration could be introduced into your software pipeline.
+ Ensure that you **CI/CD pipeline has proper segregation, configuration, and access control** to ensure the integrity of the code flowing through the build and deploy processes.
+ Ensure that unsigned or unencrypted serialized data is not sent to untrusted clients without some form of integrity check or digital signature to detect `tampering` or replay of the serialized data.

# Security Logging and Monitoring Failures
## Prevention

+ Ensure all **login, access control, and server-side input validation failures can be logged** with sufficient user context to identify suspicious or malicious account and held for enough time to allow delayed forensic analysis.
+ Ensure that **logs are generated in a format that log management solutions can easily consume**.
+ Ensure **log data is encoded correctly to prevent injections** or attacks on the logging or monitoring systems.
+ Ensure **high-value transactions have an `audit trail`** with integrity controls to prevent tampering or deletion, such as append-only database tables or similar.
+ DevSecOps teams should **establish effective monitoring and alerting** such that suspicious activities are detected and responded to quickly.
+ Establish or adopt an **incident response and recovery plan**, such as `National Institute of Standards and Technology` (*NIST*) 800-61r2 or later.

# Server-Side Request Forgery (SSRF)
## Prevention

### From Network Layer
+ Segment remote resource access functionality in separate networks to reduce the impact of SSRF.
+ Enforce **"deny by default"** firewall policies or network access control rules to block all but essential intranet traffic.
    + Establish an ownership and a lifecycle for firewall rules based on applications.
    + Log all accepted *and* blocked network flows on firewalls.

### From Application Layer
+ **Sanitize and validate** all client-supplied input data.
+ Enforce the URL schema, port, and destination with a `positive allow list`.
+ Do not send raw responses to clients.
+ Disable HTTP redirections.
+ Be aware of the URL consistency to avoid attacks such as `DNS rebinding` and "time of check, time of use" (*TOCTOU*) `race conditions`.

> Do not mitigate SSRF via the use of a deny list or regular expression. Attackers have payload lists, tools, and skills to bypass deny lists.

### Additional Measures to consider
+ Don't deploy other security relevant services on front systems (*e.g. `OpenID`*). Control local traffic on these systems (*e.g. localhost*).
+ For frontends with dedicated and manageable user groups use network encryption (*e.g. `VPNs`*) on independent systems to consider very high protection needs.

*Source: [OWASP Top 10:2021](https://owasp.org/Top10/A01_2021-Broken_Access_Control/)*