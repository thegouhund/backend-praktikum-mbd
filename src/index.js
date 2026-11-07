import express from "express";
import connection from "./db.js";

const app = express();

app.use(express.json());

app.get("/products", async (req, res) => {
  try {
    const [products] = await connection.query("CALL GetAllProduk();");
    res
      .status(200)
      .json({ message: "Produk berhasil diambil", data: products[0] });
  } catch (e) {
    console.log(e);
    if (e.sqlState === "45000") {
      res.status(400).json({ message: e.sqlMessage });
    }
    res.status(500).json({ message: "Terjadi kesalahan diserver" });
  }
});

app.post("/products", async (req, res) => {
  const { nama, harga, stok } = req.body;

  if (!nama || !harga || !stok) {
    return res
      .status(400)
      .json({ message: "Nama, harga, dan stok wajib diisi" });
  }

  try {
    const response = await connection.query("CALL CreateProduk(?, ?, ?)", [
      nama,
      harga,
      stok,
    ]);

    res.status(201).json({
      message: "Produk berhasil ditambahkan",
    });
  } catch (e) {
    console.log(e);
    if (e.sqlState === "45000") {
      res.status(400).json({ message: e.sqlMessage });
    }
    res.status(500).json({ message: "Terjadi kesalahan diserver" });
  }
});

app.put("/products/:id", async (req, res) => {
  const productId = req.params.id;
  const { nama, harga, stok } = req.body;

  if (!nama || !harga || !stok) {
    return res
      .status(400)
      .json({ message: "Nama, harga, dan stok wajib diisi" });
  }

  try {
    await connection.query("CALL UpdateProduk(?, ?, ?, ?)", [
      productId,
      nama,
      harga,
      stok,
    ]);

    res.status(200).json({
      message: "Produk berhasil diupdate",
    });
  } catch (e) {
    console.log(e);
    if (e.sqlState === "45000") {
      res.status(400).json({ message: e.sqlMessage });
    }
    res.status(500).json({ message: "Terjadi kesalahan diserver" });
  }
});

app.delete("/products/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    await connection.query("CALL DeleteProduk(?)", [productId]);

    res.status(204).json({
      message: "Produk berhasil dihapus",
    });
  } catch (e) {
    console.log(e);
    if (e.sqlState === "45000") {
      res.status(400).json({ message: e.sqlMessage });
    }
    res.status(500).json({ message: "Terjadi kesalahan diserver" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
