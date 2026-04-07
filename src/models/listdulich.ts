import React, { useState, useEffect } from 'react';

export interface DiemDen {
	id: string;
	ten: string;
	hinhAnh: string;
	diaChi: string;
	moTa: string;
	loaiHinh: 'bien' | 'nui' | 'thanh_pho';
	gia: number;
	rating: number;
	thoiGianThamQuan: number;
	chiPhi: {
		anUong: number;
		luuTru: number;
		diChuyen: number;
	};
	ngayTao: string;
}

export interface NgayTrongLichTrinh {
	id: string;
	ngay: number;
	thu: string;
	cacDiemDen: string[];
}

export interface LichTrinh {
	id: string;
	ten: string;
	ngayBatDau: string;
	ngayKetThuc: string;
	nguoiDung: string;
	ngays: NgayTrongLichTrinh[];
	tongChiPhi: number;
	createdAt: string;
}

export interface ThongKeLichTrinh {
	idLichTrinh: string;
	tenLichTrinh: string;
	ngayTao: string;
	tongChiPhi: number;
}

export interface ThongKeAdmin {
	soLichTrinhTaoTheoThang: { thang: number; soLuong: number }[];
	diaDiemPhoBien: { ten: string; soLuong: number }[];
	tongThu: number;
	thuTheoHangMuc: { ten: string; soTien: number }[];
}

const STORAGE_KEY = 'du_lich_data';

const useTravelSystem = () => {
	const getStorageData = <T>(key: string, defaultValue: T): T => {
		if (typeof window === 'undefined') return defaultValue;
		const data = localStorage.getItem(STORAGE_KEY);
		if (!data) return defaultValue;
		try {
			const parsed = JSON.parse(data);
			return parsed[key] ?? defaultValue;
		} catch {
			return defaultValue;
		}
	};

	const setStorageData = (key: string, value: unknown) => {
		if (typeof window === 'undefined') return;
		const data = localStorage.getItem(STORAGE_KEY);
		const current = data ? JSON.parse(data) : {};
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, [key]: value }));
	};

	const diemDenData = getStorageData<DiemDen[]>('diemDen', []);
	const lichTrinhData = getStorageData<LichTrinh[]>('lichTrinh', []);
	const ngansachData = getStorageData('ngansach', {
		anUong: 5000000,
		luuTru: 5000000,
		diChuyen: 3000000,
	});

	const [diemDen, setDiemDen] = useState<DiemDen[]>(diemDenData);
	const [lichTrinh, setLichTrinh] = useState<LichTrinh[]>(lichTrinhData);
	const [ngansach, setNgansach] = useState(ngansachData);
	const [thongKeAdmin, setThongKeAdmin] = useState<ThongKeAdmin>({
		soLichTrinhTaoTheoThang: [],
		diaDiemPhoBien: [],
		tongThu: 0,
		thuTheoHangMuc: [],
	});

	const tinhToanThongKe = () => {
		const thangCounts: Record<number, number> = {};
		const diaDiemCounts: Record<string, number> = {};
		let tongThu = 0;
		const hangMucThu: Record<string, number> = {
			anUong: 0,
			luuTru: 0,
			diChuyen: 0,
		};

		lichTrinh.forEach((lt) => {
			const thang = new Date(lt.createdAt).getMonth() + 1;
			thangCounts[thang] = (thangCounts[thang] || 0) + 1;
			tongThu += lt.tongChiPhi;

			lt.ngays.forEach((ngay) => {
				ngay.cacDiemDen.forEach((idDD) => {
					const dd = diemDen.find((d) => d.id === idDD);
					if (dd) {
						diaDiemCounts[dd.ten] = (diaDiemCounts[dd.ten] || 0) + 1;
						hangMucThu.anUong += dd.chiPhi.anUong;
						hangMucThu.luuTru += dd.chiPhi.luuTru;
						hangMucThu.diChuyen += dd.chiPhi.diChuyen;
					}
				});
			});
		});

		const soLichTrinhTheoThang = Object.entries(thangCounts).map(([thang, soLuong]) => ({
			thang: parseInt(thang),
			soLuong,
		}));

		const diemPhoBien = Object.entries(diaDiemCounts)
			.map(([ten, soLuong]) => ({ ten, soLuong }))
			.sort((a, b) => b.soLuong - a.soLuong)
			.slice(0, 5);

		const thuMuc = Object.entries(hangMucThu).map(([ten, soTien]) => ({ ten, soTien }));

		setThongKeAdmin({
			soLichTrinhTaoTheoThang: soLichTrinhTheoThang,
			diaDiemPhoBien: diemPhoBien,
			tongThu,
			thuTheoHangMuc: thuMuc,
		});
	};

	React.useEffect(() => {
		setStorageData('diemDen', diemDen);
	}, [diemDen]);

	React.useEffect(() => {
		setStorageData('lichTrinh', lichTrinh);
		tinhToanThongKe();
	}, [lichTrinh]);

	React.useEffect(() => {
		setStorageData('ngansach', ngansach);
	}, [ngansach]);

	const themDiemDen = (diemDenMoi: Omit<DiemDen, 'id' | 'ngayTao'>) => {
		const newDiemDen: DiemDen = {
			...diemDenMoi,
			id: Date.now().toString(),
			ngayTao: new Date().toISOString(),
		};
		setDiemDen([...diemDen, newDiemDen]);
	};

	const capNhatDiemDen = (id: string, diemDenCapNhat: Partial<DiemDen>) => {
		setDiemDen(diemDen.map((dd) => (dd.id === id ? { ...dd, ...diemDenCapNhat } : dd)));
	};

	const xoaDiemDen = (id: string) => {
		setDiemDen(diemDen.filter((dd) => dd.id !== id));
	};

	const themLichTrinh = (lichTrinhMoi: Omit<LichTrinh, 'id' | 'createdAt' | 'tongChiPhi'>) => {
		let tongChiPhi = 0;
		lichTrinhMoi.ngays.forEach((ngay) => {
			ngay.cacDiemDen.forEach((idDD) => {
				const dd = diemDen.find((d) => d.id === idDD);
				if (dd) {
					tongChiPhi += dd.chiPhi.anUong + dd.chiPhi.luuTru + dd.chiPhi.diChuyen;
				}
			});
		});

		const newLichTrinh: LichTrinh = {
			...lichTrinhMoi,
			id: Date.now().toString(),
			tongChiPhi,
			createdAt: new Date().toISOString(),
		};
		setLichTrinh([...lichTrinh, newLichTrinh]);
	};

	const capNhatLichTrinh = (id: string, lichTrinhCapNhat: Partial<LichTrinh>) => {
		const oldLichTrinh = lichTrinh.find((lt) => lt.id === id);
		if (!oldLichTrinh) return;

		const updated = { ...oldLichTrinh, ...lichTrinhCapNhat };
		let tongChiPhi = 0;
		updated.ngays.forEach((ngay) => {
			ngay.cacDiemDen.forEach((idDD) => {
				const dd = diemDen.find((d) => d.id === idDD);
				if (dd) {
					tongChiPhi += dd.chiPhi.anUong + dd.chiPhi.luuTru + dd.chiPhi.diChuyen;
				}
			});
		});
		updated.tongChiPhi = tongChiPhi;

		setLichTrinh(lichTrinh.map((lt) => (lt.id === id ? updated : lt)));
	};

	const xoaLichTrinh = (id: string) => {
		setLichTrinh(lichTrinh.filter((lt) => lt.id !== id));
	};

	const capNhatNganSach = (nganSachMoi: typeof ngansach) => {
		setNgansach(nganSachMoi);
	};

	const tinhTongChiPhi = (lichTrinhHienTai: LichTrinh) => {
		let tongChiPhi = 0;
		lichTrinhHienTai.ngays.forEach((ngay) => {
			ngay.cacDiemDen.forEach((idDD) => {
				const dd = diemDen.find((d) => d.id === idDD);
				if (dd) {
					tongChiPhi += dd.chiPhi.anUong + dd.chiPhi.luuTru + dd.chiPhi.diChuyen;
				}
			});
		});
		return tongChiPhi;
	};

	const tinhThoiGianDiChuyen = (lichTrinhHienTai: LichTrinh) => {
		let tongThoiGian = 0;
		lichTrinhHienTai.ngays.forEach((ngay, index) => {
			if (index > 0) {
				tongThoiGian += 60;
			}
			ngay.cacDiemDen.forEach((idDD) => {
				const dd = diemDen.find((d) => d.id === idDD);
				if (dd) {
					tongThoiGian += dd.thoiGianThamQuan;
				}
			});
		});
		return tongThoiGian;
	};

	return {
		diemDen,
		lichTrinh,
		ngansach,
		thongKeAdmin,
		themDiemDen,
		capNhatDiemDen,
		xoaDiemDen,
		themLichTrinh,
		capNhatLichTrinh,
		xoaLichTrinh,
		capNhatNganSach,
		tinhTongChiPhi,
		tinhThoiGianDiChuyen,
	};
};

export default useTravelSystem;
