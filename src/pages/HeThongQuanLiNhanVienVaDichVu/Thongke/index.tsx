import React, { useState, useMemo } from 'react';
import { Card, Row, Col, Select, Table, Statistic, Empty, message } from 'antd';
import {
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';
import type { LichHeThong } from '@/models/quanlylichhen';
import moment from 'moment';
import useAppointmentSystem from '@/models/quanlylichhen';

const Thongke: React.FC = () => {
	const { lichHen, dichVu, nhanVien } = useAppointmentSystem();
	const [selectedYear, setSelectedYear] = useState<number>(moment().year());
	const [selectedMonth, setSelectedMonth] = useState<number>(moment().month() + 1);

	const monthlyStats = useMemo(() => {
		const monthStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
		const filtered = lichHen.filter((apt) => apt.ngayLichHen && apt.ngayLichHen.startsWith(monthStr));

		return {
			total: filtered.length,
			completed: filtered.filter((a) => a.trangThai === 'hoan_thanh').length,
			pending: filtered.filter((a) => a.trangThai === 'cho_xu_ly').length,
			confirmed: filtered.filter((a) => a.trangThai === 'da_xac_nhan').length,
			cancelled: filtered.filter((a) => a.trangThai === 'da_huy').length,
		};
	}, [lichHen, selectedYear, selectedMonth]);

	const revenueByService = useMemo(() => {
		const monthStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
		const filtered = lichHen.filter(
			(apt) => apt.ngayLichHen && apt.ngayLichHen.startsWith(monthStr) && apt.trangThai === 'hoan_thanh',
		);

		const map = new Map<string, number>();
		filtered.forEach((apt) => {
			const service = dichVu.find((s) => s.id === apt.idDichVu);
			const price = service?.gia || 0;
			const current = map.get(apt.idDichVu) || 0;
			map.set(apt.idDichVu, current + price);
		});

		return Array.from(map.entries()).map(([serviceId, revenue]) => ({
			name: dichVu.find((s) => s.id === serviceId)?.ten || serviceId,
			value: revenue,
		}));
	}, [lichHen, dichVu, selectedYear, selectedMonth]);

	const revenueByEmployee = useMemo(() => {
		const monthStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
		const filtered = lichHen.filter(
			(apt) => apt.ngayLichHen && apt.ngayLichHen.startsWith(monthStr) && apt.trangThai === 'hoan_thanh',
		);

		const map = new Map<string, number>();
		filtered.forEach((apt) => {
			const service = dichVu.find((s) => s.id === apt.idDichVu);
			const price = service?.gia || 0;
			const current = map.get(apt.idNhanVien) || 0;
			map.set(apt.idNhanVien, current + price);
		});

		return Array.from(map.entries()).map(([empId, revenue]) => ({
			name: nhanVien.find((e) => e.id === empId)?.ten || empId,
			value: revenue,
		}));
	}, [lichHen, dichVu, nhanVien, selectedYear, selectedMonth]);

	const dailyAppointments = useMemo(() => {
		const monthStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
		const filtered = lichHen.filter(
			(apt) => apt.ngayLichHen && apt.ngayLichHen.startsWith(monthStr) && apt.trangThai === 'hoan_thanh',
		);

		const map = new Map<string, number>();
		filtered.forEach((apt) => {
			const date = apt.ngayLichHen || '';
			const current = map.get(date) || 0;
			map.set(date, current + 1);
		});

		return Array.from(map.entries())
			.map(([date, count]) => ({
				date,
				appointments: count,
			}))
			.sort((a, b) => a.date.localeCompare(b.date));
	}, [lichHen, selectedYear, selectedMonth]);

	const totalRevenue = useMemo(() => {
		const monthStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
		const filtered = lichHen.filter(
			(apt) => apt.ngayLichHen && apt.ngayLichHen.startsWith(monthStr) && apt.trangThai === 'hoan_thanh',
		);

		return filtered.reduce((sum, apt) => {
			const service = dichVu.find((s) => s.id === apt.idDichVu);
			return sum + (service?.gia || 0);
		}, 0);
	}, [lichHen, dichVu, selectedYear, selectedMonth]);

	const revenueColumns = [
		{
			title: 'Dịch vụ / Nhân viên',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Doanh thu (VND)',
			dataIndex: 'value',
			key: 'value',
			render: (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value),
		},
	];

	const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

	return (
		<div style={{ padding: '20px' }}>
			<Card title='Thống kê và báo cáo'>
				<Row gutter={[16, 16]} style={{ marginBottom: '30px' }}>
					<Col xs={12} md={6}>
						<Select
							value={selectedYear}
							onChange={setSelectedYear}
							placeholder='Chọn năm'
							options={Array.from({ length: 5 }, (_, i) => {
								const year = moment().year() - 2 + i;
								return { value: year, label: year.toString() };
							})}
						/>
					</Col>
					<Col xs={12} md={6}>
						<Select
							value={selectedMonth}
							onChange={setSelectedMonth}
							placeholder='Chọn tháng'
							options={Array.from({ length: 12 }, (_, i) => ({
								value: i + 1,
								label: `Tháng ${i + 1}`,
							}))}
						/>
					</Col>
				</Row>

				{/* Thống kê chung */}
				<Card title='Thống kê chung' style={{ marginBottom: '20px' }}>
					<Row gutter={[16, 16]}>
						<Col xs={12} sm={8} md={6}>
							<Statistic title='Tổng lịch hẹn' value={monthlyStats.total} />
						</Col>
						<Col xs={12} sm={8} md={6}>
							<Statistic title='Chờ xác nhận' value={monthlyStats.pending} valueStyle={{ color: '#faad14' }} />
						</Col>
						<Col xs={12} sm={8} md={6}>
							<Statistic title='Đã xác nhận' value={monthlyStats.confirmed} valueStyle={{ color: '#1890ff' }} />
						</Col>
						<Col xs={12} sm={8} md={6}>
							<Statistic title='Hoàn thành' value={monthlyStats.completed} valueStyle={{ color: '#52c41a' }} />
						</Col>
						<Col xs={12} sm={8} md={6}>
							<Statistic title='Bị hủy' value={monthlyStats.cancelled} valueStyle={{ color: '#ff4d4f' }} />
						</Col>
						<Col xs={12} sm={8} md={6}>
							<Statistic
								title='Tổng doanh thu'
								value={totalRevenue}
								suffix='đ'
								formatter={(value) => new Intl.NumberFormat('vi-VN').format(value as number)}
							/>
						</Col>
					</Row>
				</Card>

				{/* Doanh thu theo dịch vụ */}
				{revenueByService.length > 0 ? (
					<Card title='Doanh thu theo dịch vụ' style={{ marginBottom: '20px' }}>
						<Row gutter={[16, 16]}>
							<Col xs={24} md={12}>
								<ResponsiveContainer width='100%' height={300}>
									<BarChart data={revenueByService}>
										<CartesianGrid strokeDasharray='3 3' />
										<XAxis dataKey='name' />
										<YAxis />
										<Tooltip />
										<Bar dataKey='value' fill='#8884d8' />
									</BarChart>
								</ResponsiveContainer>
							</Col>
							<Col xs={24} md={12}>
								<ResponsiveContainer width='100%' height={300}>
									<PieChart>
										<Pie
											data={revenueByService}
											cx='50%'
											cy='50%'
											labelLine={false}
										label={(entry: any) => `${entry.name}: ${entry.value}`}
											outerRadius={80}
											fill='#8884d8'
											dataKey='value'
										>
											{revenueByService.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
											))}
										</Pie>
									</PieChart>
								</ResponsiveContainer>
							</Col>
						</Row>
						<Table dataSource={revenueByService} columns={revenueColumns} rowKey='name' pagination={false} />
					</Card>
				) : (
					<Card style={{ marginBottom: '20px' }}>
						<Empty description='Không có dữ liệu doanh thu theo dịch vụ' />
					</Card>
				)}

				{/* Doanh thu theo nhân viên */}
				{revenueByEmployee.length > 0 ? (
					<Card title='Doanh thu theo nhân viên' style={{ marginBottom: '20px' }}>
						<Row gutter={[16, 16]}>
							<Col xs={24}>
								<ResponsiveContainer width='100%' height={300}>
									<BarChart data={revenueByEmployee}>
										<CartesianGrid strokeDasharray='3 3' />
										<XAxis dataKey='name' />
										<YAxis />
										<Tooltip />
										<Bar dataKey='value' fill='#82ca9d' />
									</BarChart>
								</ResponsiveContainer>
							</Col>
						</Row>
						<Table dataSource={revenueByEmployee} columns={revenueColumns} rowKey='name' pagination={false} />
					</Card>
				) : (
					<Card style={{ marginBottom: '20px' }}>
						<Empty description='Không có dữ liệu doanh thu theo nhân viên' />
					</Card>
				)}

				{/* Lịch hẹn hàng ngày */}
				{dailyAppointments.length > 0 ? (
					<Card title='Lịch hẹn hoàn thành hàng ngày'>
						<ResponsiveContainer width='100%' height={300}>
							<LineChart data={dailyAppointments}>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis dataKey='date' angle={-45} textAnchor='end' height={80} />
								<YAxis />
								<Tooltip />
								<Legend />
								<Line type='monotone' dataKey='appointments' stroke='#8884d8' name='Số lịch hẹn' />
							</LineChart>
						</ResponsiveContainer>
					</Card>
				) : (
					<Card>
						<Empty description='Không có dữ liệu lịch hẹn' />
					</Card>
				)}
			</Card>
		</div>
	);
};

export default Thongke;
