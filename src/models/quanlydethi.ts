import { useState, useEffect } from 'react';

export type MucDo = 'de' | 'trungbinh' | 'kho' | 'ratkho';

export interface KhoiKienThuc {
	id: string;
	tenKhoi: string;
	moTa?: string;
}

export interface MonHoc {
	id: string;
	maMonHoc: string;
	tenMonHoc: string;
	soTinChi: number;
}

export interface CauHoi {
	id: string;
	maCauHoi: string;
	monHocId: string;
	noiDung: string;
	mucDo: MucDo;
	khoiKienThucId: string;
}

export interface YeuCauDeThi {
	khoiKienThucId: string;
	mucDo: MucDo;
	soLuong: number;
}

export interface CauTrucDeThi {
	id: string;
	tenCauTruc: string;
	monHocId: string;
	moTa?: string;
	yeuCau: YeuCauDeThi[];
}

export interface DeThi {
	id: string;
	maDeThi: string;
	tenDeThi: string;
	monHocId: string;
	cauTrucDeThiId?: string;
	danhSachCauHoi: CauHoi[];
	ngayTao: string;
}

export default function useQuestionBankModel() {
	const [khoiKienThuc, setKhoiKienThuc] = useState<KhoiKienThuc[]>([]);

	const [monHoc, setMonHoc] = useState<MonHoc[]>([]);

	const [cauHoi, setCauHoi] = useState<CauHoi[]>([]);

	const [cauTrucDeThi, setCauTrucDeThi] = useState<CauTrucDeThi[]>([]);

	const [deThi, setDeThi] = useState<DeThi[]>([]);
	useEffect(() => {
		const khoiData = localStorage.getItem('khoiKienThuc');
		if (khoiData) setKhoiKienThuc(JSON.parse(khoiData));

		const monHocData = localStorage.getItem('monHoc');
		if (monHocData) setMonHoc(JSON.parse(monHocData));

		const cauHoiData = localStorage.getItem('cauHoi');
		if (cauHoiData) setCauHoi(JSON.parse(cauHoiData));

		const cauTrucData = localStorage.getItem('cauTrucDeThi');
		if (cauTrucData) setCauTrucDeThi(JSON.parse(cauTrucData));

		const deThiData = localStorage.getItem('deThi');
		if (deThiData) setDeThi(JSON.parse(deThiData));
	}, []);
	useEffect(() => {
		localStorage.setItem('khoiKienThuc', JSON.stringify(khoiKienThuc));
	}, [khoiKienThuc]);

	useEffect(() => {
		localStorage.setItem('monHoc', JSON.stringify(monHoc));
	}, [monHoc]);
	useEffect(() => {
		localStorage.setItem('cauHoi', JSON.stringify(cauHoi));
	}, [cauHoi]);
	useEffect(() => {
		localStorage.setItem('cauTrucDeThi', JSON.stringify(cauTrucDeThi));
	}, [cauTrucDeThi]);

	useEffect(() => {
		localStorage.setItem('deThi', JSON.stringify(deThi));
	}, [deThi]);

	const themKhoiKienThuc = (khoiMoi: KhoiKienThuc) => {
		setKhoiKienThuc((prev) => [...prev, khoiMoi]);
	};

	const capNhatKhoiKienThuc = (id: string, khoiCapNhat: Partial<KhoiKienThuc>) => {
		setKhoiKienThuc((prev) => prev.map((k) => (k.id === id ? { ...k, ...khoiCapNhat } : k)));
	};

	const xoaKhoiKienThuc = (id: string) => {
		setKhoiKienThuc((prev) => prev.filter((k) => k.id !== id));
	};

	const themMonHoc = (monMoi: MonHoc) => {
		setMonHoc((prev) => [...prev, monMoi]);
	};

	const capNhatMonHoc = (id: string, monCapNhat: Partial<MonHoc>) => {
		setMonHoc((prev) => prev.map((m) => (m.id === id ? { ...m, ...monCapNhat } : m)));
	};

	const xoaMonHoc = (id: string) => {
		setMonHoc((prev) => prev.filter((m) => m.id !== id));
	};

	const themCauHoi = (cauHoiMoi: CauHoi) => {
		setCauHoi((prev) => [...prev, cauHoiMoi]);
	};

	const capNhatCauHoi = (id: string, cauHoiCapNhat: Partial<CauHoi>) => {
		setCauHoi((prev) => prev.map((c) => (c.id === id ? { ...c, ...cauHoiCapNhat } : c)));
	};

	const xoaCauHoi = (id: string) => {
		setCauHoi((prev) => prev.filter((c) => c.id !== id));
	};

	const timKiemCauHoi = (monHocId?: string, mucDo?: MucDo, khoiKienThucId?: string) => {
		return cauHoi.filter((c) => {
			if (monHocId && c.monHocId !== monHocId) return false;
			if (mucDo && c.mucDo !== mucDo) return false;
			if (khoiKienThucId && c.khoiKienThucId !== khoiKienThucId) return false;
			return true;
		});
	};

	const themCauTrucDeThi = (cauTrucMoi: CauTrucDeThi) => {
		setCauTrucDeThi((prev) => [...prev, cauTrucMoi]);
	};

	const capNhatCauTrucDeThi = (id: string, cauTrucCapNhat: Partial<CauTrucDeThi>) => {
		setCauTrucDeThi((prev) => prev.map((ct) => (ct.id === id ? { ...ct, ...cauTrucCapNhat } : ct)));
	};

	const xoaCauTrucDeThi = (id: string) => {
		setCauTrucDeThi((prev) => prev.filter((ct) => ct.id !== id));
	};

	const themDeThi = (deThiMoi: DeThi) => {
		setDeThi((prev) => [...prev, deThiMoi]);
	};

	const capNhatDeThi = (id: string, deThiCapNhat: Partial<DeThi>) => {
		setDeThi((prev) => prev.map((dt) => (dt.id === id ? { ...dt, ...deThiCapNhat } : dt)));
	};

	const xoaDeThi = (id: string) => {
		setDeThi((prev) => prev.filter((dt) => dt.id !== id));
	};

	const taoDeThiTheoCauTruc = (cauTrucId: string): { success: boolean; deThi?: DeThi; errors?: string[] } => {
		const cauTruc = cauTrucDeThi.find((ct) => ct.id === cauTrucId);
		if (!cauTruc) {
			return { success: false, errors: ['Không tìm thấy cấu trúc đề thi'] };
		}

		const errors: string[] = [];
		const danhSachCauHoiDaChon: CauHoi[] = [];

		for (const yeuCau of cauTruc.yeuCau) {
			const cauHoiPhuHop = cauHoi.filter(
				(c) =>
					c.monHocId === cauTruc.monHocId &&
					c.mucDo === yeuCau.mucDo &&
					c.khoiKienThucId === yeuCau.khoiKienThucId &&
					!danhSachCauHoiDaChon.includes(c),
			);

			if (cauHoiPhuHop.length < yeuCau.soLuong) {
				const khoi = khoiKienThuc.find((k) => k.id === yeuCau.khoiKienThucId);
				errors.push(
					`Không đủ câu hỏi cho khối "${khoi?.tenKhoi}" mức độ "${yeuCau.mucDo}". Cần ${yeuCau.soLuong} nhưng chỉ có ${cauHoiPhuHop.length}`,
				);
			} else {
				const cauHoiDaXaoDon = [...cauHoiPhuHop].sort(() => Math.random() - 0.5);
				danhSachCauHoiDaChon.push(...cauHoiDaXaoDon.slice(0, yeuCau.soLuong));
			}
		}

		if (errors.length > 0) {
			return { success: false, errors };
		}

		const deThiMoi: DeThi = {
			id: Date.now().toString(),
			maDeThi: `DT${Date.now()}`,
			tenDeThi: `Đề thi ${cauTruc.tenCauTruc} - ${new Date().toLocaleDateString('vi-VN')}`,
			monHocId: cauTruc.monHocId,
			cauTrucDeThiId: cauTrucId,
			danhSachCauHoi: danhSachCauHoiDaChon,
			ngayTao: new Date().toISOString(),
		};

		return { success: true, deThi: deThiMoi };
	};

	return {
		khoiKienThuc,
		themKhoiKienThuc,
		capNhatKhoiKienThuc,
		xoaKhoiKienThuc,

		monHoc,
		themMonHoc,
		capNhatMonHoc,
		xoaMonHoc,

		cauHoi,
		themCauHoi,
		capNhatCauHoi,
		xoaCauHoi,
		timKiemCauHoi,

		cauTrucDeThi,
		themCauTrucDeThi,
		capNhatCauTrucDeThi,
		xoaCauTrucDeThi,

		deThi,
		themDeThi,
		capNhatDeThi,
		xoaDeThi,
		taoDeThiTheoCauTruc,
	};
}
