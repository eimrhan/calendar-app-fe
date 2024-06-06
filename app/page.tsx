"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Sidebar from "@/components/Sidebar";
import Calendar from "./_calendar/Calendar";

type Props = {};

export default function Home(props: Props) {
	const router = useRouter();
	const [loading, setLoading] = useState(true); // Yükleniyor durumu için state

	useEffect(() => {
		//const token = localStorage.getItem("token");
		const token = true; //! silinecek satır
		
		if (!token) {
			router.push("/login");
		} else {
			setLoading(false); // Token varsa yükleniyor durumunu bitir
		}
	}, [router]);

	if (loading) {
		return null; // Yükleniyor durumunda hiçbir şey göstermemek için null döndürüyoruz
	}

	return (
		<main className="min-h-screen flex">
			<Calendar />
			{/* <Sidebar /> */}
		</main>
	);
}

