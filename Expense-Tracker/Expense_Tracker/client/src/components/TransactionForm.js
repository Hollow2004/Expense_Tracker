import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { TextField, CircularProgress } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import Cookies from "js-cookie";

const InitialForm = {
  amount: "",
  description: "",
  date: new Date(),
  category_id: "",
  type: "",
};

export default function TransactionForm({
  fetchTransactions,
  editTransaction,
  setEditTransaction,
}) {
  const user = useSelector((state) => state.auth.user);
  const categories = user?.categories || [];
  const token = Cookies.get("token");
  const [form, setForm] = useState(InitialForm);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editTransaction.amount !== undefined) {
      setForm(editTransaction);
      setEditMode(true);
    } else {
      setForm(InitialForm);
      setEditMode(false);
    }
  }, [editTransaction]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleDate(newValue) {
    setForm({ ...form, date: newValue });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    editMode ? update() : create();
  }

  function handleCancel() {
    setForm(InitialForm);
    setEditMode(false);
    setEditTransaction({});
  }

  function reload(res) {
    if (res.ok) {
      setForm(InitialForm);
      setEditMode(false);
      setEditTransaction({});
      fetchTransactions();
    }
    setLoading(false);
  }

  async function create() {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/transaction`, {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    reload(res);
  }

  async function update() {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/transaction/${editTransaction._id}`,
      {
        method: "PATCH",
        body: JSON.stringify(form),
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    reload(res);
  }

  function getCategoryNameById(params) {
    return (
      categories.find((category) => category._id === form.category_id) ?? ""
    );
  }

  return (
    <Card sx={{ minWidth: 275, marginTop: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ marginBottom: 2, color: "#34495E" ,fontWeight: "bold"}}>
          {editMode? "Update Transaction" : "Add new transaction"}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex" }}>
          <TextField
            type="number"
            sx={{ marginRight: 5 }}
            id="outlined-basic"
            label="Amount (in ₹)"
            name="amount"
            variant="outlined"
            size="small"
            value={form.amount}
            onChange={handleChange}
          />
          <TextField
            type="text"
            sx={{ marginRight: 5 }}
            id="outlined-basic"
            label="Description"
            name="description"
            variant="outlined"
            size="small"
            value={form.description}
            onChange={handleChange}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Transaction Date"
              inputFormat="DD.MM.YYYY"
              value={form.date}
              onChange={handleDate}
              renderInput={(params) => (
                <TextField sx={{ marginRight: 5 }} size="small" {...params} />
              )}
            />
          </LocalizationProvider>
          <Autocomplete
            value={getCategoryNameById()}
            onChange={(event, newValue) => {
              const newCategoryId = newValue ? newValue._id : "";
              setForm({ ...form, category_id: newCategoryId });
            }}
            id="controllable-states-demo"
            options={categories}
            sx={{ width: 200, marginRight: 5 }}
            renderInput={(params) => (
              <TextField {...params} size="small" label="Category" />
            )}
          />
          <Autocomplete
            value={form.type}
            onChange={(event, newValue) => setForm({ ...form, type: newValue })}
            options={["Expense", "Earning"]}
            sx={{ width: 150, marginRight: 5 }}
            renderInput={(params) => (
              <TextField {...params} size="small" label="Type" />
            )}
          />
          {editMode ? (
            <>
              <Button
                type="submit"
                variant="contained"
                sx={{ bgcolor: loading ? '#E74C3C' : '#E74C3C', color: 'white', '&:hover': { bgcolor: '#2C3E50' } }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : "Update"}
              </Button>
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          ) : (
            <Button
              type="submit"
              variant="contained"
              sx={{ bgcolor: loading ? '#E74C3C' : '#E74C3C', color: 'white', '&:hover': { bgcolor: '#2C3E50' } }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : "Submit"}
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
