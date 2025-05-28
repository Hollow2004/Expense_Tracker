import React, { useEffect, useState } from "react";
import { Container, Grid, Paper } from "@mui/material";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import TransactionExpenseChart from "../components/TransactionExpenseChart";
import TransactionIncomeChart from "../components/TransactionIncomeChart";
import Cookies from "js-cookie";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [editTransaction, setEditTransaction] = useState({});

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    const token = Cookies.get("token");
    const res = await fetch(`${process.env.REACT_APP_API_URL}/transaction`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const { data } = await res.json();
    console.log("Fetched Transactions:", data);
    setTransactions(data);
  }

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      {/* Form Section */}
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
        <TransactionForm
          fetchTransactions={fetchTransactions}
          editTransaction={editTransaction}
          setEditTransaction={setEditTransaction}
        />
      </Paper>

      <Grid container spacing={4}>
        {/* Transaction List Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <TransactionList
              data={transactions}
              fetchTransactions={fetchTransactions}
              setEditTransaction={setEditTransaction}
              editTransaction={editTransaction}
            />
          </Paper>
        </Grid>

        {/* Charts Section */}
        <Grid container item xs={12} spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                padding: 3,
              }}
            >
              <TransactionExpenseChart data={transactions} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                padding: 3,
              }}
            >
              <TransactionIncomeChart data={transactions} />
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
