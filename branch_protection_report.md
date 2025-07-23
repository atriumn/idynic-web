# Branch Protection and Deployment Analysis

Generated on: Tue Jul 15 01:24:51 CDT 2025

## atriumn/idynic-web

### Branch Protection:
  - main: Protected
    - Strict status checks: true
    - Required checks: Test and Quality Checks,Frontend Security Scan,Dependency Security Scan
    - Required reviews: 1
    - Dismiss stale reviews: true
    - Enforce for admins: false
    - Linear history: false
    - Require conversation resolution: true
  - develop: Branch does not exist

### Deployment Configuration:
  - Deploy workflow: Found
    - Environments:         default: 'development',development,staging,production
    - Trigger: Manual (workflow_dispatch)
    - Deploy types:         default: 'standard',standard,hotfix,rollback

---

## atriumn/idynic-backend

### Branch Protection:
  - main: Not protected
  - develop: Branch does not exist

### Deployment Configuration:
  - Deploy workflow: Found
    - Trigger: Manual (workflow_dispatch)
    - Trigger: Push
    - Trigger: Pull Request

---

## atriumn/atriumn-auth

### Branch Protection:
  - main: Protected
    - Strict status checks: false
    - Required checks: ci / test
    - Required reviews: 0
    - Dismiss stale reviews: false
    - Enforce for admins: true
    - Linear history: true
    - Require conversation resolution: false
  - develop: Branch does not exist

### Deployment Configuration:
  - Deploy workflow: Found
    - Trigger: Push
    - Trigger: Pull Request

---

## atriumn/atriumn-ai

### Branch Protection:
  - main: Protected
    - Strict status checks: true
    - Required reviews: 0
    - Dismiss stale reviews: false
    - Enforce for admins: false
    - Linear history: false
    - Require conversation resolution: false
  - develop: Not protected

### Deployment Configuration:
  - Deploy workflow: Found
    - Trigger: Manual (workflow_dispatch)

---

## atriumn/atriumn-foundations

### Branch Protection:
  - main: Protected
    - Strict status checks: true
    - Required reviews: 0
    - Dismiss stale reviews: false
    - Enforce for admins: false
    - Linear history: false
    - Require conversation resolution: false
  - develop: Not protected

### Deployment Configuration:
  - Deploy workflow: Found
    - Environments:     environment: production  # Requires manual approval
    - Trigger: Manual (workflow_dispatch)

---

## atriumn/atriumn-site

### Branch Protection:
  - main: Not protected
  - develop: Branch does not exist

### Deployment Configuration:
  - Deploy workflow: Not found

---

## atriumn/mcp-client

### Branch Protection:
  - main: Not protected
  - develop: Branch does not exist

### Deployment Configuration:
  - Deploy workflow: Not found

---

## atriumn/driift-api

### Branch Protection:
  - main: Branch does not exist
  - develop: Branch does not exist

### Deployment Configuration:
  - Deploy workflow: Not found

---

## atriumn/gliint-api

### Branch Protection:
  - main: Not protected
  - develop: Branch does not exist

### Deployment Configuration:
  - Deploy workflow: Found
    - Environments:     environment: production
    - Trigger: Push
    - Trigger: Pull Request

---

## atriumn/atriumn-universal-mcp

### Branch Protection:
  - main: Not protected
  - develop: Branch does not exist

### Deployment Configuration:
  - Deploy workflow: Not found

---

## atriumn/sdk-js

### Branch Protection:
  - main: Not protected
  - develop: Branch does not exist

### Deployment Configuration:
  - Deploy workflow: Not found

---

## atriumn/atriumn-tasks-idynic

### Branch Protection:
  - main: Branch does not exist
  - develop: Branch does not exist

### Deployment Configuration:
  - Deploy workflow: Not found

---

## atriumn/atriumn-tasks-axiomiq

### Branch Protection:
  - main: Branch does not exist
  - develop: Branch does not exist

### Deployment Configuration:
  - Deploy workflow: Not found

---

## atriumn/atriumn-sdk-ai-python

### Branch Protection:
  - main: Not protected
  - develop: Branch does not exist

### Deployment Configuration:
  - Deploy workflow: Not found

---

## atriumn/axiomiq-web

### Branch Protection:
  - main: Not protected
  - develop: Branch does not exist

### Deployment Configuration:
  - Deploy workflow: Not found

---

## atriumn/atriumn-codemind

### Branch Protection:
  - main: Not protected
  - develop: Branch does not exist

### Deployment Configuration:
  - Deploy workflow: Found
    - Trigger: Manual (workflow_dispatch)
    - Trigger: Push

---

## atriumn/atriumn-platform

### Branch Protection:
  - main: Not protected
  - develop: Branch does not exist

### Deployment Configuration:
  - Deploy workflow: Not found

---

## atriumn/atriumn-ingest

### Branch Protection:
  - main: Protected
    - Strict status checks: true
    - Required checks: ci / test,verify-checklist
    - Required reviews: 0
    - Dismiss stale reviews: false
    - Enforce for admins: true
    - Linear history: true
    - Require conversation resolution: false
  - develop: Branch does not exist

### Deployment Configuration:
  - Deploy workflow: Not found

---

## atriumn/atriumn-platform-infra

### Branch Protection:
  - main: Not protected
  - develop: Branch does not exist

### Deployment Configuration:
  - Deploy workflow: Not found

---

## atriumn/atriumn-storage

### Branch Protection:
  - main: Protected
    - Strict status checks: true
    - Required checks: Gatekeeper Checklist,ci / test
    - Required reviews: 0
    - Dismiss stale reviews: false
    - Enforce for admins: true
    - Linear history: true
    - Require conversation resolution: false
  - develop: Branch does not exist

### Deployment Configuration:
  - Deploy workflow: Not found

---

## atriumn/atriumn-central

### Branch Protection:
  - main: Not protected
  - develop: Branch does not exist

### Deployment Configuration:
  - Deploy workflow: Not found

---

## atriumn/aegis-backend

### Branch Protection:
  - main: Not protected
  - develop: Branch does not exist

### Deployment Configuration:
  - Deploy workflow: Not found

---

## atriumn/aegis-mobile

### Branch Protection:
  - main: Not protected
  - develop: Branch does not exist

### Deployment Configuration:
  - Deploy workflow: Not found

---

## atriumn/aegis-web

### Branch Protection:
  - main: Not protected
  - develop: Branch does not exist

### Deployment Configuration:
  - Deploy workflow: Not found

---

## atriumn/atriumn-sdk-go

### Branch Protection:
  - main: Not protected
  - develop: Branch does not exist

### Deployment Configuration:
  - Deploy workflow: Not found

---

## atriumn/atriumn-cli

### Branch Protection:
  - main: Not protected
  - develop: Branch does not exist

### Deployment Configuration:
  - Deploy workflow: Not found

---

## atriumn/atriumn-retriever

### Branch Protection:
  - main: Not protected
  - develop: Branch does not exist

### Deployment Configuration:
  - Deploy workflow: Not found

---

## atriumn/winplan-eval

### Branch Protection:
  - main: Not protected
  - develop: Branch does not exist

### Deployment Configuration:
  - Deploy workflow: Not found

---

## atriumn/aegis-central

### Branch Protection:
  - main: Not protected
  - develop: Branch does not exist

### Deployment Configuration:
  - Deploy workflow: Not found

---

## atriumn/atriumn-build

### Branch Protection:
  - main: Not protected
  - develop: Branch does not exist

### Deployment Configuration:
  - Deploy workflow: Not found

---

## atriumn/atriumn-issues

### Branch Protection:
  - main: Not protected
  - develop: Branch does not exist

### Deployment Configuration:
  - Deploy workflow: Not found

---

## atriumn/atriumn-utils

### Branch Protection:
  - main: Not protected
  - develop: Branch does not exist

### Deployment Configuration:
  - Deploy workflow: Not found

---

## atriumn/scout

### Branch Protection:
  - main: Not protected
  - develop: Branch does not exist

### Deployment Configuration:
  - Deploy workflow: Not found

---

## atriumn/scout-static

### Branch Protection:
  - main: Not protected
  - develop: Branch does not exist

### Deployment Configuration:
  - Deploy workflow: Not found

---

## atriumn/waiver-check

### Branch Protection:
  - main: Not protected
  - develop: Branch does not exist

### Deployment Configuration:
  - Deploy workflow: Not found

---

