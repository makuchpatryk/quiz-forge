# .specify Directory

This directory contains project specification artifacts, constitutional documents, and automation scripts for the SpecKit workflow.

## 📁 Directory Structure

```
.specify/
├── memory/                  # Constitutional memory & compliance tracking
│   ├── constitution.md      # Project constitution (principles & standards)
│   ├── constitution-compliance-report.md  # Current compliance assessment
│   └── constitution-quick-reference.md    # Developer quick guide
├── scripts/                 # Automation scripts
│   └── bash/               # Bash utilities
├── templates/              # Document templates
└── README.md              # This file
```

---

## 📜 Constitution Documents

### `memory/constitution.md`
**Purpose**: Authoritative source of project principles and standards  
**Status**: Ratified (Version 1.0.0, 2026-02-25)  
**When to Use**:
- Making architectural decisions
- Resolving technical disputes
- Onboarding new team members
- Quarterly reviews

**Key Sections**:
- Core Principles (6 NON-NEGOTIABLE rules)
- Security Standards
- Development Workflow
- Quality Gates
- Governance

---

### `memory/constitution-compliance-report.md`
**Purpose**: Assessment of codebase against constitutional requirements  
**Updated**: 2026-02-25  
**When to Use**:
- Sprint planning
- Tech debt prioritization
- Release readiness assessment

**Contains**:
- Critical violations (3)
- High priority issues (6)
- Medium priority issues (4)
- Remediation roadmap (3 phases, 51-93 hours)
- Compliance scorecard

---

### `memory/constitution-quick-reference.md`
**Purpose**: Daily development guide with practical examples  
**When to Use**:
- During coding
- Before submitting PR
- In code reviews
- When stuck on architectural question

**Contains**:
- Pre-implementation checklists
- Architecture quick rules
- Type safety examples
- Test requirement templates
- UI/UX guidelines
- Performance checklists
- Security patterns
- Common issues & solutions

---

## 🔄 SpecKit Workflow

The `.specify` directory supports the SpecKit development workflow:

### 1. **Constitution** (✅ Complete)
```bash
# You are here!
# Constitution established with principles focused on:
# - Code quality
# - Testing standards
# - UX consistency
# - Performance requirements
```

### 2. **Specification** (⏳ Next Step)
```bash
# Create spec.md with functional/non-functional requirements
# Guided by constitutional principles
/speckit.specify
```

### 3. **Plan** (⏳ Pending)
```bash
# Create plan.md with architecture and implementation strategy
# Enforces constitutional architectural boundaries
/speckit.plan
```

### 4. **Tasks** (⏳ Pending)
```bash
# Create tasks.md with granular work items
# Includes test requirements from constitution
/speckit.tasks
```

### 5. **Analysis** (⏳ Pending)
```bash
# Validate all artifacts against constitution
# Detect inconsistencies, gaps, violations
/speckit.analyze
```

### 6. **Implementation** (⏳ Pending)
```bash
# Execute tasks with constitutional compliance
/speckit.implement
```

---

## 🎯 How to Use This Directory

### For Developers
1. **Start here**: Read `memory/constitution-quick-reference.md` (30 min)
2. **Before coding**: Check relevant constitutional principles
3. **Before PR**: Review PR checklist in quick reference
4. **When stuck**: See "Common Issues & Solutions" section

### For Tech Leads
1. **Planning sprints**: Review `memory/constitution-compliance-report.md`
2. **Code reviews**: Reference constitution for decisions
3. **Onboarding**: Share quick reference with new team members
4. **Quarterly**: Review and update constitution

### For Product Owners
1. **Writing requirements**: Ensure specs align with non-functional requirements in constitution
2. **Prioritizing work**: Consider critical violations in compliance report
3. **Release planning**: Check quality gates in constitution

---

## 🚦 Current Status

### Constitution: ✅ **Ratified**
- Version: 1.0.0
- Date: 2026-02-25
- Status: Active

### Compliance: 🟡 **Partial**
- Critical Issues: 3
- High Priority: 6
- Medium Priority: 4
- **Action Required**: See compliance report

### Workflow: 📝 **Step 1 Complete**
- ✅ Constitution established
- ⏳ Specification (pending)
- ⏳ Plan (pending)
- ⏳ Tasks (pending)
- ⏳ Analysis (pending)
- ⏳ Implementation (pending)

---

## 📊 Metrics

### Constitution
- **Lines**: 242
- **Principles**: 6 core + 4 additional sections
- **NON-NEGOTIABLE Rules**: 3 (Architectural Boundaries, Type Safety, Test Coverage)

### Compliance
- **Compliance Score**: 41% (Partial)
- **Remediation Effort**: 51-93 hours
- **Phases**: 3 (Critical → High → Medium)

### Documentation
- **Total Files**: 3
- **Total Lines**: ~942
- **Coverage**: Development workflow, code quality, testing, UX, performance, security

---

## 🔒 Governance

### Amendment Process
1. Propose change in team discussion
2. Document rationale
3. Update constitution
4. Increment version number
5. Update compliance report
6. Communicate to team

### Version History
| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-25 | Initial constitution ratified |

### Ownership
- **Owner**: Entire development team
- **Maintainer**: Tech lead
- **Review Cadence**: Quarterly
- **Next Review**: 2026-05-25

---

## 🆘 Help & Support

### Questions?
- Check `memory/constitution-quick-reference.md` first
- See "Common Issues & Solutions" section
- Ask in team chat
- Create issue with `constitution` label

### Found a Problem?
- Constitution gap: Create issue
- Compliance blocker: Escalate to tech lead
- Unclear principle: Propose amendment

### Need Exception?
- Document justification in code comment
- Explain in PR description
- Get approval from reviewer
- Track as tech debt if needed

---

## 📚 External Resources

- **SpecKit Documentation**: [Link to SpecKit docs]
- **Clean Architecture**: [Uncle Bob's Clean Architecture]
- **Feature-Sliced Design**: https://feature-sliced.design/
- **WCAG 2.1 Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **Zod Documentation**: https://zod.dev/

---

## 🎓 Training Materials

### For New Developers
1. **Day 1**: Read quick reference guide
2. **Week 1**: Study constitutional principles relevant to your role
3. **Week 2**: Complete first PR with constitutional review
4. **Month 1**: Participate in code review using constitution

### For Existing Team
1. **Review compliance report** in next sprint planning
2. **Address critical violations** in current sprint
3. **Incorporate constitutional checks** in PR template
4. **Attend quarterly review** for amendments

---

## ✅ Success Indicators

The constitution is working when:
- ✅ Developers reference it without prompting
- ✅ PRs consistently pass constitutional checks
- ✅ Code reviews cite specific principles
- ✅ New patterns get added to constitution
- ✅ Compliance score improving over time
- ✅ Team feels empowered, not restricted

---

**Last Updated**: 2026-02-25  
**Maintained By**: Development Team  
**Questions?** See quick reference or ask tech lead

