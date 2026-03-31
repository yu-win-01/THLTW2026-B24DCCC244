import { useCallback, useEffect, useState } from 'react';

export namespace QuanLyCauLacBo {
	// Interface cho Câu Lạc Bộ
	export interface CauLacBo {
		id: string;
		tenCLB: string;
		anhDaiDien?: string;
		ngayThanhLap: number;
		moTa: string;
		chuNhiemCLB: string;
		hoatDong: boolean;
		ghiChu?: string;
		ngayTao?: number;
		ngayCapNhat?: number;
	}

	// Interface cho Đơn Đăng Ký Thành Viên
	export interface DonDangKyThanhVien {
		id: string;
		hoTen: string;
		email: string;
		soDienThoai: string;
		gioiTinh: 'nam' | 'nu' | 'khac';
		diaChi: string;
		soTruong: string;
		idCauLacBo: string;
		lyDoDangKy: string;
		trangThai: 'pending' | 'approved' | 'rejected';
		ghiChu?: string;
		ngayTao?: number;
		ngayCapNhat?: number;
	}

	// Interface cho Lịch Sử Thao Tác Đơn Đăng Ký
	export interface LichSuThaoTac {
		id: string;
		idDonDangKy: string;
		hanhDong: 'approved' | 'rejected' | 'edited' | 'created';
		tenNguoiThucHien: string;
		thoiGianThucHien: number;
		lyDo?: string; // Lý do từ chối
		ghiChu?: string;
	}

	// Interface cho Thành Viên Câu Lạc Bộ (từ approved registration)
	export interface ThanhVienCauLacBo {
		id: string;
		hoTen: string;
		email: string;
		soDienThoai: string;
		gioiTinh: 'nam' | 'nu' | 'khac';
		diaChi: string;
		soTruong: string;
		idCauLacBo: string;
		idDonDangKy: string;
		ngayDuyet?: number;
		trangThaiThanhVien: 'active' | 'inactive' | 'suspended';
		ghiChu?: string;
		ngayTao?: number;
		ngayCapNhat?: number;
	}

	// Interface cho Thống Kê
	export interface ThongKeHoatDong {
		tongSoCauLacBo: number;
		tongSoDonDangKy: number;
		dong_pending: number;
		dong_approved: number;
		dong_rejected: number;
		tongThanhVien: number;
		ngayCapNhat: number;
	}

	// Interface cho thống kê theo CLB
	export interface ThongKeTheoCLB {
		idCauLacBo: string;
		tenCLB: string;
		pending: number;
		approved: number;
		rejected: number;
	}

	export interface HeThongQuanLyCauLacBo {
		cauLacBo: CauLacBo[];
		donDangKy: DonDangKyThanhVien[];
		lichSuThaoTac: LichSuThaoTac[];
		thanhVien: ThanhVienCauLacBo[];
		thongKe: ThongKeHoatDong;
	}
}

const STORAGE_KEYS = {
	CAU_LAC_BO: 'clb_cau_lac_bo',
	DON_DANG_KY: 'clb_don_dang_ky',
	LICH_SU_THAO_TAC: 'clb_lich_su_thao_tac',
	THANH_VIEN: 'clb_thanh_vien',
	THONG_KE: 'clb_thong_ke',
	ALL_DATA: 'clb_all_data',
	LAST_SYNC: 'clb_last_sync',
} as const;

// Hàm tạo ID unique
const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Hook chính quản lý hệ thống câu lạc bộ
const useQuanLyCauLacBo = () => {
	const [cauLacBo, setCauLacBo] = useState<QuanLyCauLacBo.CauLacBo[]>([]);
	const [donDangKy, setDonDangKy] = useState<QuanLyCauLacBo.DonDangKyThanhVien[]>([]);
	const [lichSuThaoTac, setLichSuThaoTac] = useState<QuanLyCauLacBo.LichSuThaoTac[]>([]);
	const [thanhVien, setThanhVien] = useState<QuanLyCauLacBo.ThanhVienCauLacBo[]>([]);
	const [thongKe, setThongKe] = useState<QuanLyCauLacBo.ThongKeHoatDong>({
		tongSoCauLacBo: 0,
		tongSoDonDangKy: 0,
		dong_pending: 0,
		dong_approved: 0,
		dong_rejected: 0,
		tongThanhVien: 0,
		ngayCapNhat: Date.now(),
	});

	// Khởi tạo dữ liệu từ localStorage
	useEffect(() => {
		const initData = () => {
			try {
				const cacLacBoData = localStorage.getItem(STORAGE_KEYS.CAU_LAC_BO);
				const donDangKyData = localStorage.getItem(STORAGE_KEYS.DON_DANG_KY);
				const lichSuData = localStorage.getItem(STORAGE_KEYS.LICH_SU_THAO_TAC);
				const thanhVienData = localStorage.getItem(STORAGE_KEYS.THANH_VIEN);
				const thongKeData = localStorage.getItem(STORAGE_KEYS.THONG_KE);

				if (cacLacBoData) setCauLacBo(JSON.parse(cacLacBoData));
				if (donDangKyData) setDonDangKy(JSON.parse(donDangKyData));
				if (lichSuData) setLichSuThaoTac(JSON.parse(lichSuData));
				if (thanhVienData) setThanhVien(JSON.parse(thanhVienData));
				if (thongKeData) setThongKe(JSON.parse(thongKeData));
			} catch (error) {
				console.error('Error loading data from localStorage:', error);
			}
		};

		initData();
	}, []);

	// Cập nhật thống kê
	const updateThongKe = useCallback(() => {
		const pending = donDangKy.filter((d) => d.trangThai === 'pending').length;
		const approved = donDangKy.filter((d) => d.trangThai === 'approved').length;
		const rejected = donDangKy.filter((d) => d.trangThai === 'rejected').length;

		const newThongKe: QuanLyCauLacBo.ThongKeHoatDong = {
			tongSoCauLacBo: cauLacBo.length,
			tongSoDonDangKy: donDangKy.length,
			dong_pending: pending,
			dong_approved: approved,
			dong_rejected: rejected,
			tongThanhVien: thanhVien.length,
			ngayCapNhat: Date.now(),
		};

		setThongKe(newThongKe);
		localStorage.setItem(STORAGE_KEYS.THONG_KE, JSON.stringify(newThongKe));
	}, [cauLacBo.length, donDangKy, thanhVien.length]);

	// Cải tiến localStorage khi dữ liệu thay đổi
	useEffect(() => {
		localStorage.setItem(STORAGE_KEYS.CAU_LAC_BO, JSON.stringify(cauLacBo));
	}, [cauLacBo]);

	useEffect(() => {
		localStorage.setItem(STORAGE_KEYS.DON_DANG_KY, JSON.stringify(donDangKy));
		updateThongKe();
	}, [donDangKy, updateThongKe]);

	useEffect(() => {
		localStorage.setItem(STORAGE_KEYS.LICH_SU_THAO_TAC, JSON.stringify(lichSuThaoTac));
	}, [lichSuThaoTac]);

	useEffect(() => {
		localStorage.setItem(STORAGE_KEYS.THANH_VIEN, JSON.stringify(thanhVien));
		updateThongKe();
	}, [thanhVien, updateThongKe]);

	const addLichSuThaoTac = useCallback((data: Omit<QuanLyCauLacBo.LichSuThaoTac, 'id'>) => {
		try {
			const newLichSu: QuanLyCauLacBo.LichSuThaoTac = {
				...data,
				id: generateId(),
			};
			setLichSuThaoTac((prev) => [...prev, newLichSu]);
			return true;
		} catch (error) {
			console.error('Error adding history:', error);
			return false;
		}
	}, []);

	// ===== CÂU LẠC BỘ CRUD =====
	const themCauLacBo = useCallback((data: Omit<QuanLyCauLacBo.CauLacBo, 'id' | 'ngayTao' | 'ngayCapNhat'>) => {
		try {
			const newCLB: QuanLyCauLacBo.CauLacBo = {
				...data,
				id: generateId(),
				ngayTao: Date.now(),
				ngayCapNhat: Date.now(),
			};
			setCauLacBo((prev) => [...prev, newCLB]);
			return true;
		} catch (error) {
			console.error('Error adding CLB:', error);
			return false;
		}
	}, []);

	const capNhatCauLacBo = useCallback((id: string, data: Partial<Omit<QuanLyCauLacBo.CauLacBo, 'id' | 'ngayTao'>>) => {
		try {
			setCauLacBo((prev) => prev.map((clb) => (clb.id === id ? { ...clb, ...data, ngayCapNhat: Date.now() } : clb)));
			return true;
		} catch (error) {
			console.error('Error updating CLB:', error);
			return false;
		}
	}, []);

	const xoaCauLacBo = useCallback((id: string) => {
		try {
			setCauLacBo((prev) => prev.filter((clb) => clb.id !== id));
			setDonDangKy((prev) => prev.filter((d) => d.idCauLacBo !== id));
			setThanhVien((prev) => prev.filter((tv) => tv.idCauLacBo !== id));
			return true;
		} catch (error) {
			console.error('Error deleting CLB:', error);
			return false;
		}
	}, []);

	const getCauLacBoById = useCallback(
		(id: string) => {
			return cauLacBo.find((clb) => clb.id === id);
		},
		[cauLacBo],
	);

	const getDanhSachThanhVienCLB = useCallback(
		(idCauLacBo: string) => {
			return thanhVien.filter((tv) => tv.idCauLacBo === idCauLacBo);
		},
		[thanhVien],
	);

	// ===== ĐƠN ĐĂNG KY CRUD =====
	const themDonDangKy = useCallback(
		(data: Omit<QuanLyCauLacBo.DonDangKyThanhVien, 'id' | 'ngayTao' | 'ngayCapNhat'>) => {
			try {
				const newDon: QuanLyCauLacBo.DonDangKyThanhVien = {
					...data,
					id: generateId(),
					ngayTao: Date.now(),
					ngayCapNhat: Date.now(),
				};
				setDonDangKy((prev) => [...prev, newDon]);

				// Ghi lịch sử
				addLichSuThaoTac({
					idDonDangKy: newDon.id,
					hanhDong: 'created',
					tenNguoiThucHien: 'System',
					thoiGianThucHien: Date.now(),
				});

				return true;
			} catch (error) {
				console.error('Error adding registration:', error);
				return false;
			}
		},
		[],
	);

	const capNhatDonDangKy = useCallback(
		(id: string, data: Partial<Omit<QuanLyCauLacBo.DonDangKyThanhVien, 'id' | 'ngayTao'>>) => {
			try {
				setDonDangKy((prev) => prev.map((d) => (d.id === id ? { ...d, ...data, ngayCapNhat: Date.now() } : d)));
				return true;
			} catch (error) {
				console.error('Error updating registration:', error);
				return false;
			}
		},
		[],
	);

	const xoaDonDangKy = useCallback((id: string) => {
		try {
			setDonDangKy((prev) => prev.filter((d) => d.id !== id));
			setLichSuThaoTac((prev) => prev.filter((l) => l.idDonDangKy !== id));
			return true;
		} catch (error) {
			console.error('Error deleting registration:', error);
			return false;
		}
	}, []);

	const getDonDangKyById = useCallback(
		(id: string) => {
			return donDangKy.find((d) => d.id === id);
		},
		[donDangKy],
	);

	// ===== DUYỆT / TỪ CHỐI ĐƠN =====
	const duyetDonDangKy = useCallback(
		(ids: string[], tenNguoiDuyet: string = 'Admin') => {
			try {
				setDonDangKy((prev) =>
					prev.map((d) => (ids.includes(d.id) ? { ...d, trangThai: 'approved' as const, ngayCapNhat: Date.now() } : d)),
				);

				// Thêm được duyệt vào danh sách thành viên
				const donApproved = donDangKy.filter((d) => ids.includes(d.id));
				donApproved.forEach((don) => {
					const newThanhVien: QuanLyCauLacBo.ThanhVienCauLacBo = {
						id: generateId(),
						hoTen: don.hoTen,
						email: don.email,
						soDienThoai: don.soDienThoai,
						gioiTinh: don.gioiTinh,
						diaChi: don.diaChi,
						soTruong: don.soTruong,
						idCauLacBo: don.idCauLacBo,
						idDonDangKy: don.id,
						trangThaiThanhVien: 'active',
						ngayDuyet: Date.now(),
						ngayTao: Date.now(),
						ngayCapNhat: Date.now(),
					};
					setThanhVien((prev) => [...prev, newThanhVien]);
				});

				// Ghi lịch sử
				ids.forEach((id) => {
					addLichSuThaoTac({
						idDonDangKy: id,
						hanhDong: 'approved',
						tenNguoiThucHien: tenNguoiDuyet,
						thoiGianThucHien: Date.now(),
					});
				});

				return true;
			} catch (error) {
				console.error('Error approving registrations:', error);
				return false;
			}
		},
		[donDangKy],
	);

	const tuChoiDonDangKy = useCallback((ids: string[], lyDo: string, tenNguoiTuChoi: string = 'Admin') => {
		try {
			setDonDangKy((prev) =>
				prev.map((d) =>
					ids.includes(d.id)
						? {
								...d,
								trangThai: 'rejected' as const,
								ghiChu: lyDo,
								ngayCapNhat: Date.now(),
						  }
						: d,
				),
			);

			// Ghi lịch sử
			ids.forEach((id) => {
				addLichSuThaoTac({
					idDonDangKy: id,
					hanhDong: 'rejected',
					tenNguoiThucHien: tenNguoiTuChoi,
					thoiGianThucHien: Date.now(),
					lyDo: lyDo,
				});
			});

			return true;
		} catch (error) {
			console.error('Error rejecting registrations:', error);
			return false;
		}
	}, []);

	// ===== LỊCH SỬ THAO TÁC =====

	const getLichSuThaoTacByDonId = useCallback(
		(idDonDangKy: string) => {
			return lichSuThaoTac
				.filter((l) => l.idDonDangKy === idDonDangKy)
				.sort((a, b) => b.thoiGianThucHien - a.thoiGianThucHien);
		},
		[lichSuThaoTac],
	);

	// ===== THÀNH VIÊN CRUD =====
	const thayDoiCLBThanhVien = useCallback((ids: string[], idCLBMoi: string) => {
		try {
			setThanhVien((prev) =>
				prev.map((tv) => (ids.includes(tv.id) ? { ...tv, idCauLacBo: idCLBMoi, ngayCapNhat: Date.now() } : tv)),
			);
			return true;
		} catch (error) {
			console.error('Error changing CLB for members:', error);
			return false;
		}
	}, []);

	const xoaThanhVien = useCallback((id: string) => {
		try {
			setThanhVien((prev) => prev.filter((tv) => tv.id !== id));
			return true;
		} catch (error) {
			console.error('Error deleting member:', error);
			return false;
		}
	}, []);

	const getThongKeTheoCLB = useCallback((): QuanLyCauLacBo.ThongKeTheoCLB[] => {
		return cauLacBo.map((clb) => {
			const donTheoCLB = donDangKy.filter((d) => d.idCauLacBo === clb.id);
			return {
				idCauLacBo: clb.id,
				tenCLB: clb.tenCLB,
				pending: donTheoCLB.filter((d) => d.trangThai === 'pending').length,
				approved: donTheoCLB.filter((d) => d.trangThai === 'approved').length,
				rejected: donTheoCLB.filter((d) => d.trangThai === 'rejected').length,
			};
		});
	}, [cauLacBo, donDangKy]);

	return {
		// Data
		cauLacBo,
		donDangKy,
		lichSuThaoTac,
		thanhVien,
		thongKe,

		// CLB functions
		themCauLacBo,
		capNhatCauLacBo,
		xoaCauLacBo,
		getCauLacBoById,
		getDanhSachThanhVienCLB,

		// Đơn đăng ký functions
		themDonDangKy,
		capNhatDonDangKy,
		xoaDonDangKy,
		getDonDangKyById,

		// Duyệt/Từ chối
		duyetDonDangKy,
		tuChoiDonDangKy,

		// Lịch sử
		addLichSuThaoTac,
		getLichSuThaoTacByDonId,

		// Thành viên
		thayDoiCLBThanhVien,
		xoaThanhVien,

		// Thống kê
		getThongKeTheoCLB,
	};
};

export default useQuanLyCauLacBo;
