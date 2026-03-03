import { useState, useEffect } from 'react';

export interface tientrinhmonhoc {
	id: number;
	subjectId: number;
	Datetime: string;
	ngayhoc: Date;
	thoiLuongHoc: number;
	noiDungDaHoc: string;
	ghiChu: string;
	hoanThanh: boolean;
}

const STORAGE_KEY = 'tientrinhmonhoc_data';

const loadFromStorage = (): tientrinhmonhoc[] => {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			const data = JSON.parse(stored);
			return data.map((item: any) => ({
				...item,
				noiDungDaHoc: item.noiDungDaHoc || item.ghiChu || '',
				ghiChu: item.ghiChu || '',
				ngayhoc: item.ngayhoc || item.Datetime || new Date().toISOString(),
			}));
		}
	} catch (error) {
		console.error('lỗi khi tải dữ liệu từ localstorage:', error);
	}
	return [];
};

export const useTienTrinhMonHocModel = () => {
	const [tienTrinhMonHoc, setTienTrinhMonHoc] = useState<tientrinhmonhoc[]>(loadFromStorage());

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(tienTrinhMonHoc));
		} catch (error) {
			console.error('lưu dữ liệu trên localstorage thất bại:', error);
		}
	}, [tienTrinhMonHoc]);

	const themTienTrinhMonHoc = (
		subjectId: number,
		thoiLuongHoc: number,
		noiDungDaHoc: string,
		ghiChu: string,
		ngayhoc: Date,
	) => {
		const newTienTrinh: tientrinhmonhoc = {
			id: Date.now(),
			subjectId,
			Datetime: new Date().toISOString(),
			ngayhoc,
			thoiLuongHoc,
			noiDungDaHoc,
			ghiChu,
			hoanThanh: false,
		};
		setTienTrinhMonHoc((prev) => [...prev, newTienTrinh]);

		window.dispatchEvent(new CustomEvent('tientrinhmonhoc-updated'));
	};

	const capNhatTrangThai = (id: number, hoanThanh: boolean) => {
		setTienTrinhMonHoc((prev) => prev.map((item) => (item.id === id ? { ...item, hoanThanh } : item)));

		window.dispatchEvent(new CustomEvent('tientrinhmonhoc-updated'));
	};

	const suaTienTrinhMonHoc = (
		id: number,
		thoiLuongHoc: number,
		noiDungDaHoc: string,
		ghiChu: string,
		ngayhoc: Date,
	) => {
		setTienTrinhMonHoc((prev) =>
			prev.map((item) => (item.id === id ? { ...item, thoiLuongHoc, noiDungDaHoc, ghiChu, ngayhoc } : item)),
		);
		window.dispatchEvent(new CustomEvent('tientrinhmonhoc-updated'));
	};

	const xoaTienTrinhMonHoc = (id: number) => {
		setTienTrinhMonHoc((prev) => prev.filter((tienTrinh) => tienTrinh.id !== id));
		window.dispatchEvent(new CustomEvent('tientrinhmonhoc-updated'));
	};

	const refreshTienTrinhMonHoc = () => {
		setTienTrinhMonHoc(loadFromStorage());
	};

	return {
		tienTrinhMonHoc,
		themTienTrinhMonHoc,
		capNhatTrangThai,
		suaTienTrinhMonHoc,
		xoaTienTrinhMonHoc,
		refreshTienTrinhMonHoc,
	};
};
