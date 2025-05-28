import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { TextField, CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import Cookies from "js-cookie";
import { setUser } from "../store/auth";

const InitialForm = {
  label: "",
  icon: "",
};

const icons = ["\ud83d\ude97", "\ud83d\uded2", "\ud83e\uddfc", "\ud83d\udcc8", "\ud83c\udfe0", "\ud83c\udfe6", "\ud83d\udcb3", "\ud83d\udcb8", "\ud83c\udf7d\ufe0f"];

export default function CategoryForm({ editCategory, setEditCategory }) {
  const user = useSelector((state) => state.auth.user);
  const token = Cookies.get("token");
  const dispatch = useDispatch();
  const [form, setForm] = useState(InitialForm);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editCategory._id !== undefined) {
      setForm(editCategory);
      setEditMode(true);
    } else {
      setForm(InitialForm);
      setEditMode(false);
    }
  }, [editCategory]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    editMode ? update() : create();
  }

  function handleCancel() {
    setForm(InitialForm);
    setEditMode(false);
    setEditCategory({});
  }

  function reload(res, _user) {
    if (res.ok) {
      setForm(InitialForm);
      setEditMode(false);
      setEditCategory({});
      dispatch(setUser({ user: _user }));
    }
  }

  async function create() {
    setLoading(true);
    const res = await fetch(`${process.env.REACT_APP_API_URL}/category`, {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    setLoading(false);
    const existingCategory = user.categories.find(cat => cat.label === form.label);

    if (existingCategory) {
      const deleteRes = await fetch(`${process.env.REACT_APP_API_URL}/category/${existingCategory._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (deleteRes.ok) {
        const _user = {
          ...user,
          categories: [...user.categories.filter(cat => cat._id !== existingCategory._id), { ...form }],
        };
        reload(res, _user);
      }
    } else {
      const _user = {
        ...user,
        categories: [...user.categories, { ...form }],
      };
      reload(res, _user);
    }
  }

  async function update() {
    setLoading(true);
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/category/${editCategory._id}`,
      {
        method: "PATCH",
        body: JSON.stringify(form),
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setLoading(false);
    const _user = {
      ...user,
      categories: user.categories.map((cat) =>
        cat._id === editCategory._id ? form : cat
      ),
    };
    reload(res, _user);
  }

  function getCategoryNameById() {
    return (
      user.categories.find((category) => category._id === form.category_id) ??
      ""
    );
  }

  return (
    <Card sx={{ minWidth: 275, marginTop: 5, padding: 3, bgcolor: "#2C3E50", color: "white", boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" sx={{ marginBottom: 3 }}>
          {editMode ? "Edit Category" : "Add New Category"}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            type="text"
            id="outlined-basic"
            label="Label"
            name="label"
            variant="outlined"
            size="small"
            value={form.label}
            onChange={handleChange}
            fullWidth
            sx={{ backgroundColor: "white" }}
          />
          <Autocomplete
            value={form.icon}
            onChange={(event, newValue) => {
              setForm({ ...form, icon: newValue });
            }}
            id="icons"
            options={icons}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                label="Icon"
                variant="outlined"
                fullWidth
                sx={{ backgroundColor: "white" }}
              />
            )}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {editMode ? (
              <>
                <Button
                  type="submit"
                  color="success"
                  variant="outlined"
                  sx={{ borderColor: "#E74C3C", color: "#E74C3C", '&:hover': { bgcolor: '#2C3E50', color: 'white' } }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Update"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  sx={{ borderColor: "#BDC3C7", color: "white", '&:hover': { bgcolor: '#2C3E50', color: 'white' } }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                type="submit"
                color="primary"
                variant="contained"
                sx={{ bgcolor: "#E74C3C", color: "white", '&:hover': { bgcolor: '#2C3E50' } }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Submit"}
              </Button>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
