# Infrastructure checks (Terraform, Docker, Compose, Ansible, Kubernetes)

Read-only. Never `apply`, `plan` against real backends, `up`, or touch running hosts.

- **infra.compose-validate**: For `compose.yaml`, `compose.yml` and `docker-compose*.yml`, run `docker compose -f <file> config -q`. It's offline, and it starts nothing. Finding: invalid config, or a reference to an undefined env file or secret. Severity: medium.
- **infra.tf-validate**: Use `tofu` when the repo uses OpenTofu (an `.opentofu` lock, or the README or CI says so), otherwise `terraform`. Run `fmt -check -recursive`, then `init -backend=false` and `validate` in each root module. Run `tflint` if it's installed. Finding: validation errors, or tflint errors. A fmt-only drift gets one low ticket. Severity: high for validate errors.
- **infra.tf-pins**: Finding: providers or modules without version constraints, or a required Terraform version that's EOL. Severity: medium.
- **infra.images**: Look at Compose files, Dockerfiles and manifests. Finding: images on `:latest` or with no tag in services that matter, or base images on an EOL OS or runtime. Severity: medium.
- **infra.container-hardening**: Judgment. Finding: containers running as root without needing it, privileged containers or a mounted docker socket with no comment explaining why, secrets as literal env values in tracked files, or admin UIs bound to `0.0.0.0` when they should be on localhost or a VPN. Severity: high for secrets and exposed admin UIs, otherwise medium.
- **infra.health**: Finding: long-running services with no healthcheck or restart policy. Severity: low.
- **infra.state**: Judgment. Finding: stateful volumes or databases with no backup defined anywhere in the repo, or a restore that's never been documented. Severity: medium.
- **infra.ansible**: Run `ansible-lint` when there are playbooks and it's installed. Finding: errors in the `security` or `idempotency` categories. Severity: medium.
