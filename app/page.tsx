"use client";

import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import EcoRoundedIcon from "@mui/icons-material/EnergySavingsLeafRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";

const drawerWidth = 220;

const quickActions = [
  {
    title: "Manage Products",
    desc: "Add and track your product inventory",
    btnLabel: "Go to Products",
    btnColor: "#f97316",
    href: "/product-stock"
  },
  {
    title: "Stock Prediction",
    desc: "Forecast next week's inventory needs",
    btnLabel: "View Predictions",
    btnColor: "#f97316",
    href: "/stock-prediction"
  },
  {
    title: "Situation Solver",
    desc: "Simulate market scenarios",
    btnLabel: "Explore Scenarios",
    btnColor: "#f59e0b",
    href: "/situation-solver"
  },
];

function getScoreProgressColor(score: number) {
  if (score >= 70) return {
    bar: "linear-gradient(90deg, #4ade80, #22c55e)",
    text: "#22c55e",
    shadow: "rgba(34,197,94,0.4)",
    track: "#dcfce7",
  };
  if (score >= 40) return {
    bar: "linear-gradient(90deg, #fcd34d, #f59e0b)",
    text: "#f59e0b",
    shadow: "rgba(245,158,11,0.4)",
    track: "#fef9c3",
  };
  return {
    bar: "linear-gradient(90deg, #f87171, #ef4444)",
    text: "#ef4444",
    shadow: "rgba(239,68,68,0.4)",
    track: "#fee2e2",
  };
}

interface SaleEntry {
  id: string;
  date: string;
  productId: number;
  productName: string;
  sellingPrice: number;
  quantitySold: number;
  revenue: number;
}

interface WasteLog {
  id: string; productName: string; quantity: number; reason: string;
  costLost: number; wasteRate: number; aiSuggestion: string; date: string;
}

export default function DashboardPage() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentStock, setCurrentStock] = useState(0);
  const [sales, setSales] = useState<SaleEntry[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [wasteRate, setWasteRate] = useState(0);
  const [foodSecurityScore, setFoodSecurityScore] = useState(100);
  const [wasteLogs, setWasteLogs] = useState<WasteLog[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
      const savedProducts = localStorage.getItem('freshstock_products');
      const savedSales = localStorage.getItem('freshstock_sales');
      const savedWaste = localStorage.getItem('freshstock_waste');
      const savedMisc = localStorage.getItem('freshstock_misc');
      if (savedProducts) {
        try {
          const data = JSON.parse(savedProducts);
          const totals = data.reduce((sum: any, obj: any) => ({
            totalRevenue: sum.totalRevenue + obj.sellingPrice,
            currentStock: sum.currentStock + obj.inStock
          }), { totalRevenue: 0, currentStock: 0 })
          setTotalProducts(data.length);
          setCurrentStock(totals.currentStock);
          setTotalRevenue(totals.totalRevenue)
        } catch (e) {
          console.error("Failed to load products", e);
        }
      }

      if (savedSales) setSales(JSON.parse(savedSales))
      if (savedWaste) setWasteLogs(JSON.parse(savedWaste));
      if (savedMisc) {
        const data = JSON.parse(savedMisc);
        if (data.hasOwnProperty("totalRevenue")) {
          setTotalRevenue(data["totalRevenue"]);
        }
        if (data.hasOwnProperty("wasteRate")) {
          setWasteRate(data["wasteRate"]);
        }
        if (data.hasOwnProperty("foodSecurityScore")) {
          setFoodSecurityScore(data["foodSecurityScore"]);
        }

        
      }
      setIsLoaded(true);
  }, []);

  const scoreColor = getScoreProgressColor(foodSecurityScore);

  const statCards = [
  {
    label: "Total Products",
    value: totalProducts,
    icon: <Inventory2OutlinedIcon sx={{ fontSize: 22, color: "#f97316" }} />,
    iconBg: "#fff1e6",
  },
  {
    label: "Current Stock",
    value: `${currentStock} units`,
    icon: <BarChartRoundedIcon sx={{ fontSize: 22, color: "#f59e0b" }} />,
    iconBg: "#fef9ee",
  },
  {
    label: "Total Revenue",
    value: `RM ${totalRevenue.toFixed(2)}`,
    icon: <AttachMoneyRoundedIcon sx={{ fontSize: 22, color: "#22c55e" }} />,
    iconBg: "#f0fdf4",
  },
  {
    label: "Waste Rate",
    value: `${wasteRate}%`,
    icon: <TrendingDownRoundedIcon sx={{ fontSize: 22, color: "#ef4444" }} />,
    iconBg: "#fff1f2",
  },
];

  if (!isLoaded) return <div className="p-8">Loading...</div>;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#fdf6ef",
        p: { xs: 3, sm: 4 },
        fontFamily: '"Nunito", sans-serif',
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <Box className="mt-4 md:mt-0" sx={{ mb: 4 }}>
        <Typography
          sx={{
            fontFamily: '"Nunito", sans-serif',
            fontWeight: 900,
            fontSize: { xs: "1.8rem", sm: "2.2rem" },
            color: "#1c1007",
            lineHeight: 1.1,
            mb: 0.5,
          }}
        >
          Dashboard
        </Typography>
        <Typography
          sx={{
            fontFamily: '"Nunito", sans-serif',
            fontSize: "0.95rem",
            color: "#78614a",
            fontWeight: 500,
          }}
        >
          Monitor your inventory and food security at a glance
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr 1fr",
            md: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {statCards.map(({ label, value, icon, iconBg }) => (
          <Box
            key={label}
            sx={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              p: 2.5,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
              border: "1px solid rgba(0,0,0,0.04)",
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontFamily: '"Nunito", sans-serif',
                  fontSize: "0.78rem",
                  color: "#9e8674",
                  fontWeight: 600,
                  mb: 1,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {label}
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Nunito", sans-serif',
                  fontWeight: 800,
                  fontSize: { xs: "1.1rem", sm: "1.35rem" },
                  color: "#1c1007",
                  lineHeight: 1,
                }}
              >
                {value}
              </Typography>
            </Box>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "12px",
                backgroundColor: iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {icon}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Food Security Score */}
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: "20px",
          p: 3,
          mb: 3,
          boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
          border: "1px solid rgba(0,0,0,0.04)",
        }}
      >
        {/* Top row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 2.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: "14px",
                background: "linear-gradient(135deg, #4ade80, #22c55e)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(34,197,94,0.3)",
              }}
            >
              <EcoRoundedIcon sx={{ color: "#fff", fontSize: 24 }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontFamily: '"Nunito", sans-serif',
                  fontWeight: 800,
                  fontSize: "1rem",
                  color: "#1c1007",
                }}
              >
                Food Security Score
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Nunito", sans-serif',
                  fontSize: "0.8rem",
                  color: "#9e8674",
                  fontWeight: 500,
                }}
              >
                Community impact assessment
              </Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography
              sx={{
                fontFamily: '"Nunito", sans-serif',
                fontWeight: 900,
                fontSize: "2.4rem",
                color: scoreColor.text,
                lineHeight: 1,
              }}
            >
              {foodSecurityScore}
            </Typography>
            <Typography
              sx={{
                fontFamily: '"Nunito", sans-serif',
                fontSize: "0.75rem",
                color: "#9e8674",
                fontWeight: 600,
              }}
            >
              out of 100
            </Typography>
          </Box>
        </Box>

        {/* Progress bar */}
        <Box
          sx={{
            height: 14,
            borderRadius: "99px",
            backgroundColor: "#fde8cc",
            overflow: "hidden",
            mb: 2.5,
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: `${foodSecurityScore}%`,
              borderRadius: "99px",
              background: scoreColor.bar,
              boxShadow: `0 2px 8px ${scoreColor.shadow}`,
            }}
          />
        </Box>

        {/* Why this matters */}
        <Box
          sx={{
            backgroundColor: "#f0fdf4",
            borderRadius: "12px",
            p: 2,
            display: "flex",
            gap: 1.5,
            alignItems: "flex-start",
          }}
        >
          <InfoOutlinedIcon sx={{ color: "#22c55e", fontSize: 18, mt: "2px", flexShrink: 0 }} />
          <Box>
            <Typography
              sx={{
                fontFamily: '"Nunito", sans-serif',
                fontWeight: 700,
                fontSize: "0.85rem",
                color: "#166534",
                mb: 0.3,
              }}
            >
              Why This Matters
            </Typography>
            <Typography
              sx={{
                fontFamily: '"Nunito", sans-serif',
                fontSize: "0.82rem",
                color: "#4b7a5a",
                fontWeight: 500,
                lineHeight: 1.6,
              }}
            >
              Your food security score reflects how well you manage inventory to prevent waste while
              maintaining supply. This affects community food stability, helps control inflation, and
              ensures long-term supply sustainability.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Recent Sales + Waste Alerts */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2,
          mb: 3,
        }}
      >
        {/* Recent Sales */}
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: "20px",
            p: 3,
            boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
            border: "1px solid rgba(0,0,0,0.04)",
          }}
        >
          <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: "1rem", color: "#1c1007", mb: 0.3 }}>
            Recent Sales
          </Typography>
          <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: "0.8rem", color: "#f97316", fontWeight: 600, mb: 2 }}>
            Latest transactions
          </Typography>
          {sales.map((item, i, arr) => (
            <Box key={i}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", py: 1.5 }}>
                <Box>
                  <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: "0.9rem", color: "#1c1007" }}>
                    {item.productName}
                  </Typography>
                  <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: "0.78rem", color: "#f59e0b", fontWeight: 600 }}>
                    {item.date}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: "0.9rem", color: "#1c1007" }}>
                    RM {item.revenue.toFixed(2)}
                  </Typography>
                  <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: "0.78rem", color: "#9e8674", fontWeight: 500 }}>
                    {item.quantitySold} units
                  </Typography>
                </Box>
              </Box>
              {i < arr.length - 1 && (
                <Box sx={{ height: "1px", backgroundColor: "#fde8cc" }} />
              )}
            </Box>
          ))}
        </Box>

        {/* Waste Alerts */}
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: "20px",
            p: 3,
            boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
            border: "1px solid rgba(0,0,0,0.04)",
          }}
        >
          <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: "1rem", color: "#1c1007", mb: 0.3 }}>
            Waste Alert
          </Typography>
          <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: "0.8rem", color: "#f97316", fontWeight: 600, mb: 2 }}>
            Items requiring attention
          </Typography>
          {wasteLogs.map((item, i) => (
            <Box key={i} sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", py: 1.5 }}>
              <Box>
                <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: "0.9rem", color: "#1c1007" }}>
                  {item.productName}
                </Typography>
                <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: "0.78rem", color: "#9e8674", fontWeight: 500 }}>
                  {item.reason}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: "0.9rem", color: "#ef4444" }}>
                  -RM {item.costLost.toFixed(2)}
                </Typography>
                <Typography sx={{ fontFamily: '"Nunito", sans-serif', fontSize: "0.78rem", color: "#9e8674", fontWeight: 500 }}>
                  {item.quantity} units
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Quick Action Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: 2,
        }}
      >
        {quickActions.map(({ title, desc, btnLabel, btnColor, href }) => (
          <Box
            key={title}
            sx={{
              backgroundColor: "#fff",
              borderRadius: "20px",
              p: 3,
              boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
              border: "1px solid rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontFamily: '"Nunito", sans-serif',
                  fontWeight: 800,
                  fontSize: "1.05rem",
                  color: "#1c1007",
                  mb: 0.5,
                }}
              >
                {title}
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Nunito", sans-serif',
                  fontSize: "0.83rem",
                  color: "#9e8674",
                  fontWeight: 500,
                }}
              >
                {desc}
              </Typography>
            </Box>
            <Button
              fullWidth
              sx={{
                backgroundColor: btnColor,
                color: "#fff",
                fontFamily: '"Nunito", sans-serif',
                fontWeight: 700,
                fontSize: "0.9rem",
                borderRadius: "99px",
                py: 1.2,
                textTransform: "none",
                boxShadow: `0 4px 14px ${btnColor}55`,
                "&:hover": {
                  backgroundColor: btnColor,
                  filter: "brightness(0.93)",
                  boxShadow: `0 6px 18px ${btnColor}66`,
                },
                transition: "all 0.18s ease",
              }}
              href={href}
            >
              {btnLabel}
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
}