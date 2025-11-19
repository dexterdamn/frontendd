


'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users } from "lucide-react";
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { TrendingUp, Check, ChevronsUpDown, BarChart3, FileText   } from "lucide-react";
  // import { Bar, BarChart, XAxis, YAxis } from "recharts";
  import { PieChart, Pie, Cell } from "recharts";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// ✅ Shadcn chart + popover + command
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

import { cn } from "@/lib/utils";

const Results = () => {
  const router = useRouter();
  const [results, setResults] = useState([]);
  const [examOptions, setExamOptions] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [examTitle, setExamTitle] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
const [openView, setOpenView] = useState(false);
  const [selectedStudentResults, setSelectedStudentResults] = useState(null);
  const [totalExams, setTotalExams] = useState(0);


  const fetchAdminExams = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Authorization token is missing.");
      return;
    }

    const adminId = localStorage.getItem('admin_id');
    if (!adminId) {
      console.warn("No admin_id found in localStorage");
      return;
    }

    // ✅ Corrected endpoint
    const res = await fetch(`http://localhost:5000/admin/exams/admin/${adminId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch admin exams: ${res.status}`);
    }

    const data = await res.json();
    setTotalExams(data.length || 0);
  } catch (err) {
    console.error("Error fetching admin exams:", err);
    toast.error("Unable to fetch total exams.");
  }
};

useEffect(() => {
  fetchExams();
  fetchResults();
  fetchAdminExams(); // ✅ added
}, []);


 const handleViewStudent = async (studentId) => {
  try {
    setOpenView(false);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authorization token is missing.");
      return;
    }

    const res = await fetch(
      `http://localhost:5000/results/${studentId}/results/details`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch student results");
    }

    const data = await res.json();
    console.log("Student Results (filtered by admin):", data);

    setSelectedStudent(data);
    setTimeout(() => setOpenView(true), 0);
  } catch (err) {
    console.error("Failed to fetch student results", err);
    setSelectedStudent([]);
    setTimeout(() => setOpenView(true), 0);
  }
};

// ✅ Deduplicate students from results
const dedupedStudents = results.reduce((acc, result) => {
  if (!acc.find((s) => s.student_id === result.student_id)) {
    acc.push({
      student_id: result.student_id,
      first_name: result.first_name,
      last_name: result.last_name,
      email: result.email,
    });
  }
  return acc;
}, []);





// ✅ Compute Passing Score
const getPassingScore = (totalQuestions) => {
  if (!totalQuestions || totalQuestions <= 0) return 0;
  return Math.ceil(totalQuestions * 0.75); // 75% passing rate
};

const filteredResults = selectedExamId
  ? results.filter((r) => r.exam_id === parseInt(selectedExamId))
  : results;

const numberOfStudents = filteredResults.length;

// ✅ Count Passed / Failed
let passedCount = 0;
let failedCount = 0;

filteredResults.forEach((r) => {
  const totalQ = r.total_questions || 0;
  const passingScore = getPassingScore(totalQ);
  if (r.score >= passingScore) {
    passedCount++;
  } else {
    failedCount++;
  }
});

// ✅ Compute percentages
const passedRate = numberOfStudents > 0 ? ((passedCount / numberOfStudents) * 100).toFixed(1) : 0;
const failedRate = numberOfStudents > 0 ? ((failedCount / numberOfStudents) * 100).toFixed(1) : 0;

// ✅ Chart data with count + percentage
const chartData = [
  { category: "passed", count: passedCount, rate: passedRate, fill: "var(--chart-1)" },
  { category: "failed", count: failedCount, rate: failedRate, fill: "var(--chart-2)" },
];

const chartConfig = {
  passed: { label: "Passed", color: "var(--chart-1)" },
  failed: { label: "Failed", color: "var(--chart-2)" },
};

// ✅ Deduplicate students (unique by student_id)
const uniqueStudents = Array.from(
  new Map(
    results.map((r) => [r.student_id, {
      student_id: r.student_id,
      first_name: r.first_name,
      last_name: r.last_name,
      email: r.email,   // ✅ keep email from backend
    }])
  ).values()
);


  const fetchExamTitle = async (id) => {
    if (!id || isNaN(id)) return;
    try {
      const res = await fetch(`http://localhost:5000/exams/${id}`);
      const data = await res.json();
      setExamTitle(data.title);
    } catch (err) {
      console.error("Failed to fetch exam title", err);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('examId');
      setSelectedExamId('');
      setIsLoaded(true);
    }
  }, []);

  const fetchExams = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("No token found. Please login again.");
        return;
      }

      const response = await fetch('http://localhost:5000/exams', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      setExamOptions(data);
    } catch (error) {
      toast.error('Failed to fetch exam titles');
      console.error("Error fetching exams:", error);
    }
  };

  const fetchResults = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authorization token is missing.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/results", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorText = await response.text();
        toast.error(`Error ${response.status}: ${errorText}`);
        return;
      }

      const rawResults = await response.json();

      if (!Array.isArray(rawResults)) {
        toast.error("Invalid results format from server.");
        return;
      }

      const resultsWithQuestions = await Promise.all(
        rawResults.map(async (result) => {
          let parsedMovements = {};
          try {
            parsedMovements = result.eye_movements
              ? JSON.parse(result.eye_movements)
              : {};
          } catch {
            console.warn("Invalid eye_movements JSON");
          }

          let totalQuestions = 0;
          try {
            if (result.exam_id) {
              const examRes = await fetch(
                `http://localhost:5000/exams/${result.exam_id}/questions/count`,
                { headers: { Authorization: `Bearer ${token}` } }
              );

              if (examRes.ok) {
                const examData = await examRes.json();
                totalQuestions = examData.total_questions || 0;
              }
            }
          } catch (err) {
            console.error(`Failed to fetch questions for exam ${result.exam_id}`, err);
          }

          let numericScore = result.score;
          if (typeof result.score === 'string' && result.score.includes('/')) {
            const [scored] = result.score.split('/');
            numericScore = parseInt(scored);
          }

          return {
            ...result,
            score: numericScore,
            total_questions: totalQuestions,
            eye_movements: parsedMovements,
          };
        })
      );

      setResults(resultsWithQuestions);
    } catch (error) {
      console.error("Error fetching results:", error.message);
      toast.error("Unexpected error while fetching results.");
    }
  };

  useEffect(() => {
    fetchExams();
    fetchResults();
  }, []);

  // const filteredResults = selectedExamId
    // ? results.filter((r) => r.exam_id === parseInt(selectedExamId))
    // : results;

  // const numberOfStudents = filteredResults.length;
  const averageScore =
    numberOfStudents > 0
      ? (
          filteredResults.reduce((sum, result) => sum + result.score, 0) / numberOfStudents
        ).toFixed(2)
      : '0.00';

  const cheatingCount = filteredResults.filter(
    (r) =>
      r.eye_movements?.percentages?.left > 20 ||
      r.eye_movements?.percentages?.right > 20 ||
      r.eye_movements?.percentages?.down > 15
  ).length;

  return (
    <div className="p-4 sm:p-6 lg:p-3 font-sans">
      <h1 className="text-2xl self-center text-lg text-black dark:text-white mb-4 font-bold">
        RESULTS
      </h1>

      {/* ✅ Combobox for Exam Filter */}
      <div className="mb-6 px-4">
        <Popover open={open} onOpenChange={setOpen}>
<PopoverTrigger asChild>
  <Button
    variant="outline"
    role="combobox"
    aria-expanded={open}
    className="w-[250px] justify-between cursor-pointer"
  >
    {selectedExamId
      ? examOptions.find((exam) => exam.id.toString() === selectedExamId)?.title
      : "Overview"}
    <ChevronsUpDown className="opacity-50 " />
  </Button>
</PopoverTrigger>

          <PopoverContent className="w-[250px] p-0">
            <Command>
              <CommandInput placeholder="Search exam" className="h-9 cursor-pointer" />
              <CommandList>
                <CommandEmpty>No exam found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                  className="cursor-pointer"
                    value=""
                    onSelect={() => {
                      setSelectedExamId('');
                      setExamTitle('');
                      localStorage.removeItem("examId");
                      setOpen(false);
                    }}
                  >
                    Overview
                    <Check className={cn("ml-auto", selectedExamId === '' ? "opacity-100" : "opacity-0")} />
                  </CommandItem>
                {examOptions.map((exam) => (
  <CommandItem
    className="cursor-pointer"
    key={exam.id}
    value={exam.title.toLowerCase()} // 👈 searchable by title
    onSelect={() => {
      setSelectedExamId(exam.id.toString()); // ✅ still save exam ID
      localStorage.setItem("examId", exam.id.toString());
      fetchExamTitle(exam.id);
      setOpen(false);
    }}
  >
    {exam.title}
    <Check
      className={cn(
        "ml-auto ",
        selectedExamId === exam.id.toString() ? "opacity-100" : "opacity-0"
      )}
    />
  </CommandItem>
))}

                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {isLoaded && !selectedExamId && (
  <div className="grid grid-cols-1 gap-4 px-4 mb-6">
    {/* ================== TOP ROW: 2 SUMMARY CARDS ================== */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* ✅ Students Taken Card */}
      <Card className="border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg bg-white dark:bg-gray-800 p-6 text-center">
        <CardHeader className="flex items-center justify-center gap-2 p-2">
          <Users className="h-4 w-4 text-gray-700 dark:text-white" />
          <CardTitle className="text-base font-bold text-black dark:text-white">
            Students Taken
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
            {numberOfStudents}
          </p>
        </CardContent>
      </Card>

      {/* ✅ Cheating Detected Card */}
      <Card className="border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg bg-white dark:bg-gray-800 p-6 text-center">
        <CardHeader className="flex items-center justify-center gap-2 p-2">
            <FileText className="h-5 w-5 text-black dark:text-white" />
          <CardTitle className="text-base font-bold text-black dark:text-white">
           Total Exam
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
             {totalExams}
          </p>
        </CardContent>
      </Card>
    </div>

    {/* ================== BOTTOM ROW: ASSESSMENT SCORE ================== */}
    <Card className="border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg bg-white dark:bg-gray-800 p-6 text-center">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-black dark:text-white">
          Assessment Score
        </CardTitle>
        <div className="text-sm font-sans text-black dark:text-white">
          2025-2026 Academic Year
        </div>
      </CardHeader>

      <CardContent className="flex justify-center">
        <ChartContainer config={chartConfig} className="h-[350px] w-[350px]">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={130}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={chartConfig[entry.category]?.color || "#d94207ff"}
                />
              ))}
            </Pie>
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload && payload.length > 0) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg bg-white dark:bg-gray-900 p-2 shadow-md">
                      <p className="font-medium">
                        {chartConfig[data.category].label}
                      </p>
                      <p>
                        {data.count} ({data.rate}%)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex justify-center text-sm text-gray-700 dark:text-gray-300">
        <div className="flex items-center gap-6 flex-wrap justify-center">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm font-sans text-gray-700 dark:text-white">
              Avg. Score: {averageScore}
            </span>
          </div>
          {chartData.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: chartConfig[entry.category]?.color }}
              />
              <span>
                {chartConfig[entry.category]?.label}: {entry.count}
              </span>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  </div>
)}


      {isLoaded && !selectedExamId && (
        <div >

        </div>
      )}

      {/* ✅ Results Table */}
      {selectedExamId && (
        <>
          <div className="flex items-center justify-between px-4 mb-6">
            <Button
              className="cursor-pointer"
              onClick={async () => {
                try {
                  const token = localStorage.getItem("token");
                  if (!selectedExamId || !token) {
                    toast.error("Exam not selected or token missing.");
                    return;
                  }
                  if (filteredResults.length === 0) {
                    toast.error("No student results available to send.");
                    return;
                  }
                  const response = await fetch("http://localhost:5000/results/send-summary", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ exam_id: selectedExamId }),
                  });

                  const data = await response.json();
                  if (response.status === 409) {
                    toast.error(data.message || "No new results to send.");
                    return;
                  }
                  if (!response.ok) {
                    throw new Error(data.error || "Failed to send result.");
                  }
                  toast.success(`Results sent to ${data.total_students} students for "${data.exam_title}"`);
                } catch (error) {
                  console.error("Send summary error:", error);
                  toast.error("Error sending result.");
                }
              }}
            >
              Send Result
            </Button>
          </div>

          <div className="px-4 overflow-auto">
            <table className="min-w-full border-collapse border border-gray-600 bg-white dark:bg-gray-800">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="border border-gray-600 px-4 py-2">Student ID</th>
                  <th className="border border-gray-600 px-4 py-2">Name</th>
                  <th className="border border-gray-600 px-4 py-2">Score</th>
                  <th className="border border-gray-600 px-4 py-2">Eye Movement</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((result) => (
                  <tr key={result.result_id}>
                    <td className="border px-4 py-2 text-center">{result.student_id}</td>
                    <td className="border px-4 py-2 text-center">
                      {result.first_name} {result.last_name}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {result.score} / {result.total_questions}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <p><strong>Center:</strong> {result.eye_movements?.percentages?.center?.toFixed(2) || 0}%</p>
                      <p><strong>Left:</strong> {result.eye_movements?.percentages?.left?.toFixed(2) || 0}%</p>
                      <p><strong>Right:</strong> {result.eye_movements?.percentages?.right?.toFixed(2) || 0}%</p>
                      <p><strong>Down:</strong> {result.eye_movements?.percentages?.down?.toFixed(2) || 0}%</p>
                      <div className="mt-2 text-sm">
                        {(() => {
                          const { center = 0, left = 0, right = 0, down = 0 } =
                            result.eye_movements?.percentages || {};
                          const isCheating =
                            (left > 20 || right > 20 || down > 15) && center < 75;

                          return isCheating ? (
                            <>
                              <span className="text-red-600 font-semibold">⚠️ Cheating Behavior Detected</span>
                              <div className="text-xs text-gray-700 mt-1 italic">
                                Center below 75% or too much movement
                              </div>
                            </>
                          ) : (
                            <span className="text-green-600 font-semibold">✔️ Normal Behavior</span>
                          );
                        })()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Results;
