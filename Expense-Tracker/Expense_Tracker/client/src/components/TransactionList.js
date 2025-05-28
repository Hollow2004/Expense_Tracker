import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useSelector } from "react-redux";
import { Typography } from "@mui/material";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import IconButton from "@mui/material/IconButton";
import dayjs from "dayjs";
import Cookies from "js-cookie";

export default function TransactionList({
  data,
  fetchTransactions,
  setEditTransaction,
  editTransaction,
}) {
  const token = Cookies.get("token");
  const user = useSelector((state) => state.auth.user);

  // Debugging data output
  // alert(JSON.stringify(data, null, 2));

  // Fetch category name by ID
  function categoryName(id) {
    if (!user) {
      return "Loading";
    }
    const category = user.categories.find(
      (category) => category._id === id
    );
    return category ? category.icon : "N/A";
  }

  // Remove transaction by ID
  async function remove(_id) {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/transaction/${_id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.ok) {
      fetchTransactions();
    }
  }

  // Format date to DD.MM.YYYY
  function formatDate(date) {
    return dayjs(date).format("DD.MM.YYYY");
  }

  return (
    <>
      <Typography
        variant="h6"
        sx={{
          marginBottom: 2,
          fontWeight: "bold",
          color: "#34495E",
        }}
      >
        Transaction history
      </Typography>
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="transaction table">
          <TableHead sx={{ bgcolor: "#2C3E50" }}>
            <TableRow>
              <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>Amount</TableCell>
              <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>Description</TableCell>
              <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>Category</TableCell>
              <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>Date</TableCell>
              <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>Type</TableCell>
              <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((month) =>
              month.transactions.map((row) => (
                <TableRow
                  key={row._id}
                  sx={{
                    "&:nth-of-type(odd)": { bgcolor: "#F8F9F9" },
                    "&:hover": { bgcolor: "#EAEDED" },
                  }}
                >
                  <TableCell
                    align="center"
                    component="th"
                    scope="row"
                    sx={{ fontWeight: "bold", color: "#2C3E50" }}
                  >
                    ₹{row.amount}
                  </TableCell>
                  <TableCell align="center" sx={{ color: "#2C3E50" }}>
                    {row.description}
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: 20, color: "#2C3E50" }}>
                    {categoryName(row.category_id)}
                  </TableCell>
                  <TableCell align="center" sx={{ color: "#2C3E50" }}>
                    {formatDate(row.date)}
                  </TableCell>
                  {/* Updated Type Column with Conditional Colors */}
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      color: row.type === "Expense" ? "#E74C3C" : "#27AE60", // Red for Expense, Green for Earning
                    }}
                  >
                    {row.type}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      component="label"
                      onClick={() => setEditTransaction(row)}
                      disabled={editTransaction.amount !== undefined}
                    >
                      <EditSharpIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      component="label"
                      onClick={() => remove(row._id)}
                      disabled={editTransaction.amount !== undefined}
                    >
                      <DeleteSharpIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
