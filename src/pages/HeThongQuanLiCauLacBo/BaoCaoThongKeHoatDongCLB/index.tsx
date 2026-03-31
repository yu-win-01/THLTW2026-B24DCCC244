import React from 'react';
import { Card, Row, Col, Statistic, Table, Empty } from 'antd';
import {
	TeamOutlined,
	FileTextOutlined,
	CheckCircleOutlined,
	ClockCircleOutlined,
	CloseCircleOutlined,
	UnorderedListOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import type { QuanLyCauLacBo } from '@/models/quanlyclb';
import useQuanLyCauLacBo from '@/models/quanlyclb';
import ColumnChart from '@/components/Chart/ColumnChart';

const BaoCaoThongKeHoatDongCLB: React.FC = () => {
	const { thongKe, getThongKeTheoCLB, cauLacBo } = useQuanLyCauLacBo();

	const thongKeTheoCLB = getThongKeTheoCLB();

	const chartData = {
		title: 'Số đơn đăng ký theo từng câu lạc bộ',
		xAxis: thongKeTheoCLB.map((s) => s.tenCLB),
		yAxis: [
			thongKeTheoCLB.map((s) => s.pending),
			thongKeTheoCLB.map((s) => s.approved),
			thongKeTheoCLB.map((s) => s.rejected),
		],
		yLabel: ['Chờ xử lý', 'Đã duyệt', 'Đã từ chối'],
		colors: ['#faad14', '#52c41a', '#f5222d'],
		height: 400,
	};

	const thongKeTableColumns = [
		{
			title: 'Câu lạc bộ',
			dataIndex: 'tenCLB',
			key: 'tenCLB',
			sorter: (a: any, b: any) => a.tenCLB.localeCompare(b.tenCLB),
			align: 'center' as const,
		},
		{
			title: 'Chờ xử lý',
			dataIndex: 'pending',
			key: 'pending',
			align: 'center' as const,
			sorter: (a: any, b: any) => a.pending - b.pending,
			render: (text: number) => <span style={{ color: '#faad14', fontWeight: 'bold' }}>{text}</span>,
		},
		{
			title: 'Đã duyệt',
			dataIndex: 'approved',
			key: 'approved',
			align: 'center' as const,
			sorter: (a: any, b: any) => a.approved - b.approved,
			render: (text: number) => <span style={{ color: '#52c41a', fontWeight: 'bold' }}>{text}</span>,
		},
		{
			title: 'Đã từ chối',
			dataIndex: 'rejected',
			key: 'rejected',
			align: 'center' as const,
			sorter: (a: any, b: any) => a.rejected - b.rejected,
			render: (text: number) => <span style={{ color: '#f5222d', fontWeight: 'bold' }}>{text}</span>,
		},
		{
			title: 'Tổng cộng',
			key: 'total',
			align: 'center' as const,
			render: (_: any, record: QuanLyCauLacBo.ThongKeTheoCLB) => (
				<strong>{record.pending + record.approved + record.rejected}</strong>
			),
			sorter: (a: any, b: any) => a.pending + a.approved + a.rejected - (b.pending + b.approved + b.rejected),
		},
	];

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
			<Card title='Tóm tắt chung'>
				<Row gutter={[16, 16]}>
					<Col xs={24} sm={12} lg={6}>
						<Statistic
							title='Số lượng câu lạc bộ'
							value={thongKe.tongSoCauLacBo}
							prefix={<UnorderedListOutlined />}
							valueStyle={{ color: '#1890ff' }}
						/>
					</Col>
					<Col xs={24} sm={12} lg={6}>
						<Statistic
							title='Tổng số đơn đăng ký'
							value={thongKe.tongSoDonDangKy}
							prefix={<FileTextOutlined />}
							valueStyle={{ color: '#722ed1' }}
						/>
					</Col>
					<Col xs={24} sm={12} lg={6}>
						<Statistic
							title='Đơn chờ xử lý'
							value={thongKe.dong_pending}
							prefix={<ClockCircleOutlined />}
							valueStyle={{ color: '#faad14' }}
						/>
					</Col>
					<Col xs={24} sm={12} lg={6}>
						<Statistic
							title='Đơn đã duyệt'
							value={thongKe.dong_approved}
							prefix={<CheckCircleOutlined />}
							valueStyle={{ color: '#52c41a' }}
						/>
					</Col>
					<Col xs={24} sm={12} lg={6}>
						<Statistic
							title='Đơn đã từ chối'
							value={thongKe.dong_rejected}
							prefix={<CloseCircleOutlined />}
							valueStyle={{ color: '#f5222d' }}
						/>
					</Col>
					<Col xs={24} sm={12} lg={6}>
						<Statistic
							title='Tổng số thành viên'
							value={thongKe.tongThanhVien}
							prefix={<TeamOutlined />}
							valueStyle={{ color: '#13c2c2' }}
						/>
					</Col>
				</Row>
				<Row style={{ marginTop: '16px' }}>
					<Col span={24} style={{ fontSize: '12px', color: '#999' }}>
						Cập nhật lần cuối: {moment(thongKe.ngayCapNhat).format('DD/MM/YYYY HH:mm:ss')}
					</Col>
				</Row>
			</Card>

			{cauLacBo.length > 0 ? (
				<Card>
					<ColumnChart {...chartData} />
				</Card>
			) : (
				<Card title='Số đơn đăng ký theo từng câu lạc bộ'>
					<Empty description='Chưa có dữ liệu' />
				</Card>
			)}

			<Card title='Bảng thống kê chi tiết theo câu lạc bộ'>
				{thongKeTheoCLB.length > 0 ? (
					<Table
						columns={thongKeTableColumns as any}
						dataSource={thongKeTheoCLB}
						rowKey='idCauLacBo'
						pagination={false}
						scroll={{ x: 800 }}
						summary={(data) => {
							const totalPending = data.reduce((sum, item) => sum + item.pending, 0);
							const totalApproved = data.reduce((sum, item) => sum + item.approved, 0);
							const totalRejected = data.reduce((sum, item) => sum + item.rejected, 0);
							const totalAll = totalPending + totalApproved + totalRejected;

							return (
								<Table.Summary.Row style={{ fontWeight: 'bold' }}>
									<Table.Summary.Cell index={0}>Tổng cộng</Table.Summary.Cell>
									<Table.Summary.Cell index={1} align='center'>
										<span style={{ color: '#faad14' }}>{totalPending}</span>
									</Table.Summary.Cell>
									<Table.Summary.Cell index={2} align='center'>
										<span style={{ color: '#52c41a' }}>{totalApproved}</span>
									</Table.Summary.Cell>
									<Table.Summary.Cell index={3} align='center'>
										<span style={{ color: '#f5222d' }}>{totalRejected}</span>
									</Table.Summary.Cell>
									<Table.Summary.Cell index={4} align='center'>
										{totalAll}
									</Table.Summary.Cell>
								</Table.Summary.Row>
							);
						}}
					/>
				) : (
					<Empty description='Chưa có dữ liệu' />
				)}
			</Card>

			{thongKe.tongSoDonDangKy > 0 && (
				<Card title='Tỷ lệ phần trăm'>
					<Row gutter={[16, 16]}>
						<Col xs={24} sm={12} lg={8}>
							<Statistic
								title='Tỷ lệ chờ xử lý'
								value={((thongKe.dong_pending / thongKe.tongSoDonDangKy) * 100).toFixed(1)}
								suffix='%'
								valueStyle={{ color: '#faad14' }}
							/>
						</Col>
						<Col xs={24} sm={12} lg={8}>
							<Statistic
								title='Tỷ lệ duyệt'
								value={((thongKe.dong_approved / thongKe.tongSoDonDangKy) * 100).toFixed(1)}
								suffix='%'
								valueStyle={{ color: '#52c41a' }}
							/>
						</Col>
						<Col xs={24} sm={12} lg={8}>
							<Statistic
								title='Tỷ lệ từ chối'
								value={((thongKe.dong_rejected / thongKe.tongSoDonDangKy) * 100).toFixed(1)}
								suffix='%'
								valueStyle={{ color: '#f5222d' }}
							/>
						</Col>
					</Row>
				</Card>
			)}
		</div>
	);
};

export default BaoCaoThongKeHoatDongCLB;
