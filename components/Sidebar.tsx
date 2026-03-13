"use client";

import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import MenuIcon from "@mui/icons-material/Menu";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactElement } from "react";
import * as React from "react";

const drawerWidth = 220;

type NavItem = {
	label: string;
	icon: ReactElement;
	colored?: string;
	href: string;
};

const navItems: NavItem[] = [
	{
		label: "Dashboard",
		icon: <DashboardRoundedIcon fontSize="small" />,
		href: "/",
	},
	{
		label: "Product Stock",
		icon: <Inventory2OutlinedIcon fontSize="small" />,
		href: "/product-stock",
	},
	{
		label: "Stock Prediction",
		icon: <TrendingUpOutlinedIcon fontSize="small" />,
		href: "/stock-prediction",
	},
	{
		label: "Waste Tracker",
		icon: <DeleteOutlineRoundedIcon fontSize="small" />,
		href: "/waste-tracker",
	},
	{
		label: "Supplier Prices",
		icon: <AttachMoneyRoundedIcon fontSize="small" />,
		href: "/supplier-prices",
	},
	{
		label: "Sales Tracker",
		icon: <BarChartRoundedIcon fontSize="small" />,
		href: "/sales-tracker",
	},
	{
		label: "Situation Solver",
		icon: <WarningAmberRoundedIcon fontSize="small" />,
		href: "/situation-solver",
	},
];

interface Props {
	window?: () => Window;
}

export default function Sidebar(props: Props) {
	const { window } = props;
	const pathname = usePathname();

	const [mobileOpen, setMobileOpen] = React.useState(false);
	const [isClosing, setIsClosing] = React.useState(false);

	const handleDrawerClose = () => {
		setIsClosing(true);
		setMobileOpen(false);
	};
	const handleDrawerTransitionEnd = () => setIsClosing(false);
	const handleDrawerToggle = () => {
		if (!isClosing) setMobileOpen(!mobileOpen);
	};

	const drawer = (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				height: "100%",
				py: 2.5,
				px: 1.5,
			}}
		>
			{/* Logo */}
			<Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 1 }}>
				<Box
					sx={{
						width: 40,
						height: 40,
						borderRadius: "50%",
						background: "linear-gradient(135deg, #fb923c, #f97316)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						boxShadow: "0 4px 12px rgba(249,115,22,0.35)",
						flexShrink: 0,
					}}
				>
					<StorefrontRoundedIcon sx={{ color: "#fff", fontSize: 20 }} />
				</Box>
				<Box>
					<Box
						sx={{
							fontFamily: '"Nunito", sans-serif',
							fontWeight: 800,
							fontSize: "1rem",
							color: "#1e293b",
							lineHeight: 1.1,
						}}
					>
						FreshStock
					</Box>
					<Box
						sx={{
							fontFamily: '"Nunito", sans-serif',
							fontSize: "0.7rem",
							color: "#627693",
							fontWeight: 500,
						}}
					>
						Smart Inventory
					</Box>
				</Box>
			</Box>

			<Divider sx={{ my: 2 }} />

			{/* Nav Items */}
			<List
				disablePadding
				sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
			>
				{navItems.map(({ label, icon, colored, href }) => {
					// Exact match for '/', prefix match for everything else
					const active =
						href === "/" ? pathname === "/" : pathname.startsWith(href);

					return (
						<ListItem key={label} disablePadding>
							<ListItemButton
								component={Link}
								href={href}
								onClick={() => setMobileOpen(false)}
								sx={{
									borderRadius: "10px",
									px: 1.5,
									py: 1,
									backgroundColor: active ? "#f97316" : "transparent",
									"&:hover": {
										backgroundColor: active
											? "#ea6c0a"
											: "rgba(249,115,22,0.08)",
									},
									transition: "background-color 0.18s ease",
									"&:focus": {
										outline: "solid",
									},
								}}
							>
								<ListItemIcon
									sx={{
										minWidth: 32,
										color: active ? "#fff" : colored || "#64748b",
									}}
								>
									{icon}
								</ListItemIcon>
								<ListItemText
									primary={label}
									slotProps={{
										primary: {
											sx: {
												fontFamily: '"Nunito", sans-serif',
												fontWeight: active ? 700 : 500,
												fontSize: "0.875rem",
												color: active ? "#fff" : colored || "#333333",
											},
										},
									}}
								/>
							</ListItemButton>
						</ListItem>
					);
				})}
			</List>
		</Box>
	);

	const container =
		window !== undefined ? () => window().document.body : undefined;

	return (
		<>
			<link
				href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;700;800&display=swap"
				rel="stylesheet"
			/>
			<CssBaseline />

			<IconButton
				aria-label="open drawer"
				onClick={handleDrawerToggle}
				sx={{
					backgroundColor: "white",
					"&:hover": { backgroundColor: "#f3f2f1" },
					position: "fixed",
					top: 10,
					left: 10,
					display: { sm: "none" },
					zIndex: 1200,
				}}
			>
				<MenuIcon />
			</IconButton>

			<Box
				component="nav"
				sx={{ width: { xs: 0, sm: drawerWidth }, flexShrink: { sm: 0 } }}
			>
				<Drawer
					container={container}
					variant="temporary"
					open={mobileOpen}
					onTransitionEnd={handleDrawerTransitionEnd}
					onClose={handleDrawerClose}
					sx={{
						display: { xs: "block", sm: "none" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: drawerWidth,
							border: "none",
							boxShadow: "4px 0 24px rgba(0,0,0,0.08)",
						},
					}}
					slotProps={{ root: { keepMounted: true } }}
				>
					{drawer}
				</Drawer>

				<Drawer
					variant="permanent"
					sx={{
						display: { xs: "none", sm: "block" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: drawerWidth,
							border: "none",
							boxShadow: "4px 0 20px rgba(0,0,0,0.06)",
						},
					}}
					open
				>
					{drawer}
				</Drawer>
			</Box>
		</>
	);
}
