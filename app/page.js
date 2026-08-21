import Sidebar from "@/components/SideBar";
import TopTabs from "@/components/TopTabs";
import JobToolbar from "@/components/JobToolbar";
import JobList from "@/components/JobList";
import MockInterviewPanel from "@/components/MockInterviewPanel";

const jobs = [
  {
    id: 1,
    title: "Web Application Developer",
    company: "Badck Business Funding",
    location: "Austin, Texas Metropolitan Area",
    workType: "On-site",
    match: 64,
    employmentType: "Full time",
    experience: "0 of 3 skills match",
    level: "Mid Level",
    salary: "$65k/yr - $70k/yr",
    posted: "1 hours ago",
    applicants: 25,
    liked: false,
  },
  {
    id: 2,
    title: "Software Engineer, Network Infrastructure",
    company: "Cursor AI",
    location: "Sunnyvale, CA",
    workType: "On-site",
    match: 93,
    employmentType: "Full time",
    experience: "5+ years exp",
    level: "Mid Level",
    salary: "$161k/yr - $239k/yr",
    posted: "2 hours ago",
    applicants: 25,
    liked: true,
  },
  {
    id: 3,
    title: "Full-Stack Software Engineer (Web Developer)",
    company: "Simons Foundation",
    location: "New York, NY",
    workType: "On-site",
    match: 82,
    employmentType: "Full time",
    experience: "5+ years exp",
    level: "Mid Level",
    salary: "$125k/yr - $140k/yr",
    posted: "2 hours ago",
    applicants: 25,
    liked: false,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f3f3f3]">
      <div className="mx-auto flex min-h-screen max-w-[1360px] bg-[#f7f7f7]">

        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">

          <TopTabs />

          <div className="flex flex-1 gap-5 p-5">

            <section className="min-w-0 flex-1">
              <JobToolbar />

              <JobList jobs={jobs} />
            </section>

            <MockInterviewPanel />

          </div>

        </div>

      </div>
    </main>
  );
}