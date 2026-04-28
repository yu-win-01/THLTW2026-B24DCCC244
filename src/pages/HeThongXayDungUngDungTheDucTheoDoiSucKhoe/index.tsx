import React, { useMemo } from 'react';
import { Card, Row, Col, Statistic, Timeline } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer } from 'recharts';
import { CalendarOutlined, FireOutlined, TrophyOutlined, RiseOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

const TrangChu: React.FC = () => {
	const { danhSachBuoiTap, danhSachChiSoSucKhoe, danhSachMucTieu } = useModel('ungdungtheodoisuckhoe');

	const thangHienTai = new Date().getMonth();
	const namHienTai = new Date().getFullYear();

	const tongBuoiTapThangNay = useMemo(() => {
		return danhSachBuoiTap.filter((bt) => {
			const ngay = new Date(bt.ngay);
			return ngay.getMonth() === thangHienTai && ngay.getFullYear() === namHienTai;
		}).length;
	}, [danhSachBuoiTap, thangHienTai, namHienTai]);

	const tongCaloDaDot = useMemo(() => {
		return danhSachBuoiTap.reduce((tong, bt) => tong + bt.caloDot, 0);
	}, [danhSachBuoiTap]);

	const soNgayTapLienTiep = useMemo(() => {
		let soNgay = 0;
		const homNay = new Date();
		homNay.setHours(0, 0, 0, 0);

		const danhSachBuoiTapDaSapXep = [...danhSachBuoiTap]
			.filter((bt) => bt.trangThai === 'Completed')
			.sort((a, b) => new Date(b.ngay).getTime() - new Date(a.ngay).getTime());

		for (let i = 0; i < danhSachBuoiTapDaSapXep.length; i++) {
			const ngayBuoiTap = new Date(danhSachBuoiTapDaSapXep[i].ngay);
			ngayBuoiTap.setHours(0, 0, 0, 0);
			const ngayDuocMongDoi = new Date(homNay);
			ngayDuocMongDoi.setDate(homNay.getDate() - i);

			if (ngayBuoiTap.getTime() === ngayDuocMongDoi.getTime()) {
				soNgay++;
			} else {
				break;
			}
		}
		return soNgay;
	}, [danhSachBuoiTap]);

	const phanTramHoanThanhMucTieu = useMemo(() => {
		const mucTieuDangThucHien = danhSachMucTieu.filter((mt) => mt.trangThai === 'Đang thực hiện');
		if (mucTieuDangThucHien.length === 0) return 0;

		const tongTienDo = mucTieuDangThucHien.reduce((tong, mt) => {
			return tong + Math.min((mt.giaTriHienTai / mt.giaTriMucTieu) * 100, 100);
		}, 0);

		return Math.round(tongTienDo / mucTieuDangThucHien.length);
	}, [danhSachMucTieu]);

	const duLieuBuoiTapTheoTuan = useMemo(() => {
		const cacTuan: Record<string, number> = {};
		danhSachBuoiTap.forEach((bt) => {
			const ngay = new Date(bt.ngay);
			if (ngay.getMonth() === thangHienTai && ngay.getFullYear() === namHienTai) {
				const tuan = Math.ceil(ngay.getDate() / 7);
				const khoaTuan = `Tuần ${tuan}`;
				cacTuan[khoaTuan] = (cacTuan[khoaTuan] || 0) + 1;
			}
		});

		return Object.entries(cacTuan).map(([tuan, soLuong]) => ({ tuan, soLuong }));
	}, [danhSachBuoiTap, thangHienTai, namHienTai]);

	const duLieuCanNangTheoThoiGian = useMemo(() => {
		return danhSachChiSoSucKhoe
			.sort((a, b) => new Date(a.ngay).getTime() - new Date(b.ngay).getTime())
			.map((cs) => ({
				ngay: new Date(cs.ngay).toLocaleDateString(),
				canNang: cs.canNang,
			}));
	}, [danhSachChiSoSucKhoe]);

	const cacBuoiTapGanNhat = useMemo(() => {
		return danhSachBuoiTap
			.sort((a, b) => new Date(b.ngay).getTime() - new Date(a.ngay).getTime())
			.slice(0, 5)
			.map((bt) => ({
				id: bt.id,
				ngay: new Date(bt.ngay).toLocaleDateString(),
				loai: bt.loai,
				thoiLuong: bt.thoiLuong,
				caloDot: bt.caloDot,
				trangThai: bt.trangThai,
			}));
	}, [danhSachBuoiTap]);

	return (
		<div>
			<Row gutter={16} style={{ marginBottom: 24 }}>
				<Col span={6}>
					<Card>
						<Statistic title='Tổng buổi tập tháng này' value={tongBuoiTapThangNay} prefix={<CalendarOutlined />} />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic title='Tổng calo đã đốt' value={tongCaloDaDot} prefix={<FireOutlined />} />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic title='Ngày tập liên tiếp' value={soNgayTapLienTiep} prefix={<TrophyOutlined />} />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic
							title='Hoàn thành mục tiêu'
							value={phanTramHoanThanhMucTieu}
							suffix='%'
							prefix={<RiseOutlined />}
						/>
					</Card>
				</Col>
			</Row>

			<Row gutter={16} style={{ marginBottom: 24 }}>
				<Col span={12}>
					<Card title='Số buổi tập theo tuần'>
						<ResponsiveContainer width='100%' height={300}>
							<BarChart data={duLieuBuoiTapTheoTuan}>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis dataKey='tuan' />
								<YAxis />
								<Tooltip />
								<Bar dataKey='soLuong' fill='#8884d8' />
							</BarChart>
						</ResponsiveContainer>
					</Card>
				</Col>
				<Col span={12}>
					<Card title='Sự thay đổi cân nặng'>
						<ResponsiveContainer width='100%' height={300}>
							<LineChart data={duLieuCanNangTheoThoiGian}>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis dataKey='ngay' />
								<YAxis />
								<Tooltip />
								<Line type='monotone' dataKey='canNang' stroke='#82ca9d' />
							</LineChart>
						</ResponsiveContainer>
					</Card>
				</Col>
			</Row>

			<Card title='Buổi tập gần nhất'>
				<Timeline>
					{cacBuoiTapGanNhat.map((buoiTap) => (
						<Timeline.Item key={buoiTap.id} color={buoiTap.trangThai === 'Completed' ? 'green' : 'red'}>
							<p>
								<strong>{buoiTap.ngay}</strong>
							</p>
							<p>Loại: {buoiTap.loai}</p>
							<p>Thời lượng: {buoiTap.thoiLuong} phút</p>
							<p>Calo: {buoiTap.caloDot}</p>
							<p>Trạng thái: {buoiTap.trangThai}</p>
						</Timeline.Item>
					))}
				</Timeline>
			</Card>
		</div>
	);
};

export default TrangChu;
