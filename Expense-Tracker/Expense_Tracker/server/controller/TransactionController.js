import Transaction from "../models/transaction.js";

export const index = async (req, res) => {
  const transaction = await Transaction.aggregate([
    {
      $match: { user_id: req.user._id },
    },
    {
      $group: {
        _id: { $month: "$date" },
        transactions: {
          $push: {
            amount: "$amount",
            description: "$description",
            date: "$date",
            _id: "$_id",
            category_id: "$category_id",
            type: "$type",
          },
        },
        totalExpenses: {
          $sum: {
            $cond: [{ $eq: ["$type", "Expense"] }, "$amount", 0],
          },
        },
        totalIncome: {
          $sum: {
            $cond: [{ $eq: ["$type", "Earning"] }, "$amount", 0],
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  res.json({ data: transaction });
};

export const create = async (req, res) => {
  const { amount, description, date, category_id, type } = req.body;
  const transaction = new Transaction({
    amount,
    description,
    user_id: req.user._id,
    date,
    category_id,
    type,
  });
  await transaction.save();
  res.json({ message: "Success" });
};

export const destroy = async (req, res) => {
  await Transaction.deleteOne({ _id: req.params.id });
  res.json({ message: "Success" });
};

export const update = async (req, res) => {
  await Transaction.updateOne({ _id: req.params.id }, { $set: req.body });
  res.json({ message: "Success" });
};
