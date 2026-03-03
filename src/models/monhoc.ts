import { useState, useEffect } from 'react';

export interface monhoc {
	id: number;
	tenMonHoc: string;
}

const STORAGE_KEY = 'monHoc_data';

const loadFromStorage = (): monhoc[] => {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			return JSON.parse(stored);
		}
	} catch (error) {
		console.error('lỗi khi tải dữ liệu từ localstorage:', error);
	}
	return [];
};

export const useMonHocModel = () => {
	const [monHoc, setMonHoc] = useState<monhoc[]>(loadFromStorage());

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(monHoc));
		} catch (error) {
			console.error('lưu dữ liệu trên localstorage thất bại:', error);
		}
	}, [monHoc]);

	const themMonHoc = (ten: string) => {
		const newMon: monhoc = {
			id: Date.now(),
			tenMonHoc: ten,
		};
		setMonHoc((prev) => [...prev, newMon]);
	};

	const suaMonHoc = (id: number, ten: string) => {
		setMonHoc((prev) => prev.map((mon) => (mon.id === id ? { ...mon, tenMonHoc: ten } : mon)));
	};

	const xoaMonHoc = (id: number) => {
		setMonHoc((prev) => prev.filter((mon) => mon.id !== id));
	};

	const refreshMonHoc = () => {
		setMonHoc(loadFromStorage());
	};

	return {
		monHoc,
		themMonHoc,
		suaMonHoc,
		xoaMonHoc,
		refreshMonHoc,
	};
};
