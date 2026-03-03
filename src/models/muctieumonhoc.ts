import { useState, useEffect } from 'react';

export interface muctieumonhoc {
	id: number;
	subjectId: number;
	muctieu: number;
}

const STORAGE_KEY = 'muctieumonhoc_data';

const loadFromStorage = (): muctieumonhoc[] => {
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

export const useMucTieuMonHocModel = () => {
	const [mucTieuMonHoc, setMucTieuMonHoc] = useState<muctieumonhoc[]>(loadFromStorage());

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(mucTieuMonHoc));
		} catch (error) {
			console.error('lưu dữ liệu trên localstorage thất bại:', error);
		}
	}, [mucTieuMonHoc]);

	const themMucTieuMonHoc = (subjectId: number, muctieu: number) => {
		const newMucTieu: muctieumonhoc = {
			id: Date.now(),
			subjectId,
			muctieu,
		};
		setMucTieuMonHoc((prev) => [...prev, newMucTieu]);
		window.dispatchEvent(new CustomEvent('muctieumonhoc-updated'));
	};

	const suaMucTieuMonHoc = (id: number, muctieu: number) => {
		setMucTieuMonHoc((prev) => prev.map((item) => (item.id === id ? { ...item, muctieu } : item)));
		window.dispatchEvent(new CustomEvent('muctieumonhoc-updated'));
	};

	const xoaMucTieuMonHoc = (id: number) => {
		setMucTieuMonHoc((prev) => prev.filter((mucTieu) => mucTieu.id !== id));
		window.dispatchEvent(new CustomEvent('muctieumonhoc-updated'));
	};

	const refreshMucTieuMonHoc = () => {
		setMucTieuMonHoc(loadFromStorage());
	};

	return {
		mucTieuMonHoc,
		themMucTieuMonHoc,
		suaMucTieuMonHoc,
		xoaMucTieuMonHoc,
		refreshMucTieuMonHoc,
	};
};
