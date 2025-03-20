# Draggable & Sortable Table with Infinite Scrolling

This project is a **React-based table component** with the following features:
- **Drag & Drop Column Reordering** using `react-dnd`
- **Column Sorting** using `@table-library/react-table-library/sort`
- **Infinite Scrolling with Backend-Driven Pagination**
- **Loading Indicator & "No More Records Found" Message**
- **Custom Styling using Material UI Theme**

This component is designed to be integrated into **CRM/ERP systems** for better data visualization and user experience.

---

## 🚀 Features
- **Drag & Drop Reordering** – Rearrange columns dynamically.
- **Sorting on Columns** – Click column headers to sort in ascending/descending order.
- **Infinite Scrolling** – Fetches 10 records at a time.
- **Optimized Performance** – Uses an Intersection Observer for smooth scrolling.
- **Persisted Column Order** – Stores column layout in `localStorage`.

---

## 🛠️ Installation & Setup
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/MeetD99/CRM-Table.git
cd CRM-Table
```
### 2️⃣ Install Dependencies
```bash
npm install
```
### 3️⃣ Start the Application
```bash
npm run dev
```
This runs the app on localhost:5173

## Integration into a CRM/ERP System
To integrate this table into an existing CRM/ERP system, follow these steps:
### 1️⃣ Import the Table Component
```bash
import Table from './Table';
```
### 2️⃣ Use the Component in Your CRM/ERP Dashboard
```bash
function Dashboard() {
  return (
    <div>
      <h2>Customer Records</h2>
      <Table />
    </div>
  );
}

export default Dashboard;
```


## Connecting a Backend API (Paginated Data Fetching)
Currently, the table uses static data (nodes.js). To fetch data from a backend API (e.g., Node.js, Python, or Java), follow these steps:

### 1️⃣ Modify fetchMoreData() to Call an API
Replace the existing fetchMoreData() function with:
```bash
const fetchMoreData = async () => {
  if (loading || !hasMore) return;
  setLoading(true);

  try {
    const response = await fetch(`https://your-api.com/data?page=${page}&limit=10`);
    const result = await response.json();

    if (result.data.length === 0) {
      setHasMore(false);
    } else {
      setData((prevData) => [...prevData, ...result.data]);
      setPage(prevPage => prevPage + 1);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  setLoading(false);
};
```
Ensure your backend API supports pagination via query parameters (page and limit).


## How the Backend Integration Works
- Frontend requests paginated data: https://your-api.com/data?page=1&limit=10
- Backend returns 10 records per request.
- Frontend appends new records on scroll.
- When no more records are available, "No more records found" is displayed.

