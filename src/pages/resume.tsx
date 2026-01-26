import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Navigation links for the navbar
const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Resume', href: '/resume' },
  { name: 'Story', href: '/story' },
  { name: 'Blog', href: '/blog' },
  { name: 'Projects', href: '/projects' },
];

// Placeholder resume data
const resumeData = {
  lastUpdated: 'January 2026',
  education: [
    {
      degree: 'Master of Science in Computer Science',
      school: 'Stanford University',
      location: 'Stanford, CA',
      period: '2020 - 2022',
      details: [
        'Specialization in Artificial Intelligence and Machine Learning',
        'GPA: 3.9/4.0',
        'Thesis: "Efficient Transformer Architectures for Edge Devices"',
      ],
    },
    {
      degree: 'Bachelor of Science in Computer Science',
      school: 'University of Texas at Austin',
      location: 'Austin, TX',
      period: '2016 - 2020',
      details: [
        'Minor in Mathematics',
        'GPA: 3.8/4.0',
        'Dean\'s List all semesters',
      ],
    },
  ],
  experience: [
    {
      title: 'Senior Software Engineer',
      company: 'Tech Company Inc.',
      location: 'San Francisco, CA',
      period: 'Jan 2023 - Present',
      details: [
        'Led development of microservices architecture serving 10M+ daily active users',
        'Reduced API response times by 40% through optimization and caching strategies',
        'Mentored team of 5 junior engineers and established code review best practices',
        'Implemented CI/CD pipelines reducing deployment time from hours to minutes',
      ],
    },
    {
      title: 'Software Engineer',
      company: 'Startup Labs',
      location: 'Austin, TX',
      period: 'Jun 2022 - Dec 2022',
      details: [
        'Built real-time collaboration features using WebSocket and Redis',
        'Developed REST APIs using Node.js and TypeScript',
        'Collaborated with product team to deliver features on tight deadlines',
      ],
    },
    {
      title: 'Software Engineering Intern',
      company: 'Big Tech Corp',
      location: 'Seattle, WA',
      period: 'Summer 2021',
      details: [
        'Developed internal tooling for automated testing infrastructure',
        'Contributed to open-source projects used by millions of developers',
        'Received return offer based on performance',
      ],
    },
  ],
  projects: [
    {
      name: 'Open Source CLI Tool',
      description: 'A command-line tool for developers with 5K+ GitHub stars',
      technologies: ['Rust', 'TypeScript', 'GitHub Actions'],
    },
    {
      name: 'Real-time Analytics Dashboard',
      description: 'Full-stack dashboard processing 1M+ events per day',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis'],
    },
    {
      name: 'Machine Learning Pipeline',
      description: 'End-to-end ML pipeline for predictive analytics',
      technologies: ['Python', 'PyTorch', 'Docker', 'Kubernetes'],
    },
  ],
  skills: {
    languages: ['TypeScript', 'Python', 'Rust', 'Go', 'Java', 'SQL'],
    frameworks: ['React', 'Next.js', 'Node.js', 'FastAPI', 'Django'],
    tools: ['Docker', 'Kubernetes', 'AWS', 'GCP', 'PostgreSQL', 'Redis'],
    practices: ['CI/CD', 'TDD', 'Agile', 'Code Review', 'System Design'],
  },
};

function CopyEmailButton() {
  const [copied, setCopied] = useState(false);
  const email = 'alfredo@example.com';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="group flex items-center gap-2 text-[0.875rem] text-[#555555] transition-colors hover:text-[#242424]"
      aria-label={copied ? 'Email copied!' : 'Copy email address'}
    >
      <span>{email}</span>
      {copied ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-4 w-4 text-green-600"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
          />
        </svg>
      )}
    </button>
  );
}

function NavBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navbar when at top or scrolling up
      if (currentScrollY < 50 || currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 border-b border-[#E5E5E5] bg-[#FAFAFA] transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Left side: Download Resume & Email */}
        <div className="flex items-center gap-4">
          <a
            href="/resume.pdf"
            download
            className="inline-flex items-center gap-2 rounded-full border border-[#242424] bg-[#242424] px-4 py-2 text-[0.875rem] font-medium text-white transition-all hover:bg-white hover:text-[#242424]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            Download Resume
          </a>
          <div className="hidden sm:block">
            <CopyEmailButton />
          </div>
        </div>

        {/* Center: Navigation Links */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`text-[0.875rem] transition-colors hover:text-[#242424] ${
                link.href === '/resume'
                  ? 'font-semibold text-[#242424]'
                  : 'text-[#555555]'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right side: Account Icon */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E5E5] bg-white text-[#555555] transition-colors hover:border-[#555555] hover:text-[#242424]"
          aria-label="Account"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-6 text-[1.5rem] font-semibold text-[#242424]">
      {children}
    </h2>
  );
}

function EducationSection() {
  return (
    <section className="mb-12">
      <SectionTitle>Education</SectionTitle>
      <div className="space-y-6">
        {resumeData.education.map((edu, index) => (
          <div
            key={index}
            className="rounded-lg border border-[#E5E5E5] bg-white p-5"
          >
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
              <div>
                <h3 className="text-[1rem] font-semibold text-[#242424]">
                  {edu.degree}
                </h3>
                <p className="text-[0.875rem] text-[#555555]">
                  {edu.school} - {edu.location}
                </p>
              </div>
              <span className="shrink-0 text-[0.875rem] text-[#555555]">
                {edu.period}
              </span>
            </div>
            <ul className="mt-3 space-y-1">
              {edu.details.map((detail, i) => (
                <li key={i} className="flex items-start gap-2 text-[0.875rem] text-[#555555]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#555555]" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function ExperienceSection() {
  return (
    <section className="mb-12">
      <SectionTitle>Experience</SectionTitle>
      <div className="space-y-6">
        {resumeData.experience.map((exp, index) => (
          <div
            key={index}
            className="rounded-lg border border-[#E5E5E5] bg-white p-5"
          >
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
              <div>
                <h3 className="text-[1rem] font-semibold text-[#242424]">
                  {exp.title}
                </h3>
                <p className="text-[0.875rem] text-[#555555]">
                  {exp.company} - {exp.location}
                </p>
              </div>
              <span className="shrink-0 text-[0.875rem] text-[#555555]">
                {exp.period}
              </span>
            </div>
            <ul className="mt-3 space-y-1">
              {exp.details.map((detail, i) => (
                <li key={i} className="flex items-start gap-2 text-[0.875rem] text-[#555555]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#555555]" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProjectsSection() {
  return (
    <section className="mb-12">
      <SectionTitle>Projects</SectionTitle>
      <div className="space-y-6">
        {resumeData.projects.map((project, index) => (
          <div
            key={index}
            className="rounded-lg border border-[#E5E5E5] bg-white p-5"
          >
            <h3 className="text-[1rem] font-semibold text-[#242424]">
              {project.name}
            </h3>
            <p className="mt-1 text-[0.875rem] text-[#555555]">
              {project.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-[#F5F5F5] px-3 py-1 text-[0.75rem] font-medium text-[#555555]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SkillsSection() {
  const skillCategories = [
    { title: 'Languages', skills: resumeData.skills.languages },
    { title: 'Frameworks', skills: resumeData.skills.frameworks },
    { title: 'Tools & Platforms', skills: resumeData.skills.tools },
    { title: 'Practices', skills: resumeData.skills.practices },
  ];

  return (
    <section className="mb-12">
      <SectionTitle>Skills</SectionTitle>
      <div className="rounded-lg border border-[#E5E5E5] bg-white p-5">
        <div className="grid gap-6 sm:grid-cols-2">
          {skillCategories.map((category) => (
            <div key={category.title}>
              <h3 className="mb-2 text-[0.875rem] font-semibold text-[#242424]">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-[#F5F5F5] px-3 py-1 text-[0.75rem] font-medium text-[#555555]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ResumePage() {
  return (
    <>
      <NavBar />
      <div className="min-h-screen px-4 pb-16 pt-24">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <header className="mb-12 text-center">
            <h1 className="text-[2.5rem] font-bold tracking-tight text-[#242424]">
              Resume
            </h1>
            <p className="mt-2 text-[0.875rem] text-[#555555]">
              Last Updated: {resumeData.lastUpdated}
            </p>
          </header>

          {/* Resume Content */}
          <EducationSection />
          <ExperienceSection />
          <ProjectsSection />
          <SkillsSection />
        </div>
      </div>
    </>
  );
}
