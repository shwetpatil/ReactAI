import { useState } from "react";

type Employee = {
  id: number;
  name: string;
  salary: number;
  experience: number;
};

const employees: Employee[] = [
  {
    id: 1,
    name: "Shweta",
    salary: 5000000,
    experience: 10,
  },
  {
    id: 2,
    name: "Rahul",
    salary: 3200000,
    experience: 6,
  },
  {
    id: 3,
    name: "Priya",
    salary: 4100000,
    experience: 8,
  },
  {
    id: 4,
    name: "Amit",
    salary: 2800000,
    experience: 4,
  },
  {
    id: 5,
    name: "Sneha",
    salary: 3600000,
    experience: 7,
  },
  {
    id: 6,
    name: "Vikram",
    salary: 5400000,
    experience: 12,
  },
  {
    id: 7,
    name: "Anjali",
    salary: 2500000,
    experience: 3,
  },
  {
    id: 8,
    name: "Karan",
    salary: 4700000,
    experience: 9,
  },
  {
    id: 9,
    name: "Meera",
    salary: 3000000,
    experience: 5,
  },
  {
    id: 10,
    name: "Arjun",
    salary: 6200000,
    experience: 15,
  },
];

type SortType = "asc" | "dsc";

export function Table() {
  const columns = Object.keys(employees[0]) as (keyof Employee)[];

  const [sortColumn, setSortColumn] = useState<keyof Employee>("name");
  const [sortType, setSortType] = useState<SortType>("asc");

  function sortEmployees(column: keyof Employee) {
    if (column === sortColumn) {
      setSortType((prev) => (prev === "asc" ? "dsc" : "asc"));
    } else {
      setSortColumn(column);
      setSortType("asc");
    }
  }

  const sortedEmployees = [...employees].sort((a, b) => {
    const valueA = a[sortColumn];
    const valueB = b[sortColumn];

    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortType === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    return sortType === "asc"
      ? Number(valueA) - Number(valueB)
      : Number(valueB) - Number(valueA);
  });

  return (
    <table border={1}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column}
              onClick={() => sortEmployees(column)}
              style={{ cursor: "pointer" }}
            >
              {column}

              {sortColumn === column &&
                (sortType === "asc" ? " ▲" : " ▼")}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {sortedEmployees.map((employee) => (
          <tr key={employee.id}>
            {columns.map((column) => (
              <td key={column}>{employee[column]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}