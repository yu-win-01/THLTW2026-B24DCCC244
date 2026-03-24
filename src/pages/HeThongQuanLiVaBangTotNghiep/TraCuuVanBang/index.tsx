import React, { useState, useMemo } from 'react';
import {
	Table,
	Button,
	Form,
	Input,
	Select,
	message,
	Card,
	Row,
	Col,
	Drawer,
	Divider,
	Tag,
	Alert,
	Space,
	Statistic,
	Empty,
	Modal,
} from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { QuanLyVanBang } from '@/models/quanlyvanbang';
import useDocumentManagementSystem from '@/models/quanlyvanbang';

const TraCuuVanBang: React.FC = () => {
	const { vanBang, quyetDinh, soVanBang, traCuuVanBang, thongKeTraCuu } = useDocumentManagementSystem();
	const [isDetailDrawerVisible, setIsDetailDrawerVisible] = useState(false);
	const [selectedRecord, setSelectedRecord] = useState<QuanLyVanBang.ThongTinVanBang | null>(null);
	const [form] = Form.useForm();
	const [searchFilters, setSearchFilters] = useState<Partial<QuanLyVanBang.TraCuuVanBang>>({});
	const [searchResults, setSearchResults] = useState<QuanLyVanBang.ThongTinVanBang[]>([]);
	const [hasSearched, setHasSearched] = useState(false);
	const [searchParamCount, setSearchParamCount] = useState(0);

	const handleSearch = async () => {
		try {
			const values = await form.validateFields();
			const paramCount = Object.values(values).filter((v) => v).length;

			if (paramCount < 2) {
				message.warning('Vui lòng nhập ít nhất 2 tham số tìm kiếm');
				return;
			}

			const filters: Partial<QuanLyVanBang.TraCuuVanBang> = {};
			if (values.soHieuVanBang) filters.soHieuVanBang = values.soHieuVanBang;
			if (values.soVaoSo) filters.soVaoSo = values.soVaoSo;
			if (values.maSinhVien) filters.maSinhVien = values.maSinhVien;
			if (values.hoTen) filters.hoTen = values.hoTen;
			if (values.ngaySinh) filters.ngaySinh = values.ngaySinh;
			if (values.idQuyetDinh) filters.idQuyetDinh = values.idQuyetDinh;

			const results = traCuuVanBang(filters);
			setSearchResults(results);
			setSearchFilters(filters);
			setSearchParamCount(paramCount);
			setHasSearched(true);

			if (results.length === 0) {
				message.info('Không tìm thấy kết quả phù hợp');
			} else {
				message.success(`Tìm thấy ${results.length} kết quả`);
			}
		} catch (error) {
			message.error('Vui lòng kiểm tra lại thông tin tìm kiếm');
		}
	};

	const handleReset = () => {
		form.resetFields();
		setSearchResults([]);
		setSearchFilters({});
		setHasSearched(false);
		setSearchParamCount(0);
	};

	const handleViewDetail = (record: QuanLyVanBang.ThongTinVanBang) => {
		setSelectedRecord(record);
		setIsDetailDrawerVisible(true);
	};

	const getQuyetDinhInfo = (id: string) => {
		return quyetDinh.find((q) => q.id === id);
	};

	const getSoVanBangInfo = (id: string) => {
		return soVanBang.find((s) => s.id === id);
	};

	const getThongKeTraCuu = (idQuyetDinh: string) => {
		return thongKeTraCuu.find((tk) => tk.idQuyetDinh === idQuyetDinh);
	};

	const selectedQuyetDinhThongKe = useMemo(() => {
		if (!selectedRecord) return null;
		return getThongKeTraCuu(selectedRecord.idQuyetDinh);
	}, [selectedRecord, thongKeTraCuu]);

	const columns = [
		{
			title: 'Số Vào Sổ',
			dataIndex: 'soVaoSo',
			key: 'soVaoSo',
			align: 'center' as const,
		},
		{
			title: 'Số Hiệu Văn Bằng',
			dataIndex: 'soHieuVanBang',
			key: 'soHieuVanBang',
			align: 'center' as const,
		},
		{
			title: 'Mã Sinh Viên',
			dataIndex: 'maSinhVien',
			key: 'maSinhVien',
			align: 'center' as const,
		},
		{
			title: 'Họ Tên',
			dataIndex: 'hoTen',
			key: 'hoTen',
			align: 'center' as const,
		},
		{
			title: 'Ngày Sinh',
			dataIndex: 'ngaySinh',
			key: 'ngaySinh',
			render: (text: string) => moment(text, 'YYYY-MM-DD').format('DD/MM/YYYY'),
			align: 'center' as const,
		},
		{
			title: 'Quyết Định',
			dataIndex: 'idQuyetDinh',
			key: 'idQuyetDinh',
			render: (text: string) => {
				const qd = getQuyetDinhInfo(text);
				return qd ? qd.soQuyetDinh : 'N/A';
			},
			align: 'center' as const,
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_: any, record: QuanLyVanBang.ThongTinVanBang) => (
				<Button type='text' icon={<EyeOutlined />} onClick={() => handleViewDetail(record)} title='Xem chi tiết' />
			),
			align: 'center' as const,
		},
	];

	return (
		<Card>
			<h2 style={{ marginBottom: '24px' }}>Tra Cứu Văn Bằng Tốt Nghiệp</h2>

			<Card style={{ marginBottom: '24px' }} title='Tiêu Chí Tìm Kiếm'>
				<Alert
					message='Vui lòng nhập ít nhất 2 tham số để tìm kiếm'
					type='info'
					showIcon
					style={{ marginBottom: '16px' }}
				/>

				<Form form={form} layout='vertical'>
					<Row gutter={16}>
						<Col xs={24} sm={12} lg={6}>
							<Form.Item name='soHieuVanBang' label='Số Hiệu Văn Bằng'>
								<Input placeholder='VD: VB-2024-001' />
							</Form.Item>
						</Col>
						<Col xs={24} sm={12} lg={6}>
							<Form.Item name='soVaoSo' label='Số Vào Sổ'>
								<Input type='number' placeholder='Nhập số vào sổ' />
							</Form.Item>
						</Col>
						<Col xs={24} sm={12} lg={6}>
							<Form.Item name='maSinhVien' label='Mã Sinh Viên'>
								<Input placeholder='VD: STU2024001' />
							</Form.Item>
						</Col>
						<Col xs={24} sm={12} lg={6}>
							<Form.Item name='hoTen' label='Họ Tên'>
								<Input placeholder='Nhập họ tên sinh viên' />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col xs={24} sm={12} lg={6}>
							<Form.Item name='ngaySinh' label='Ngày Sinh'>
								<Input type='date' />
							</Form.Item>
						</Col>
						<Col xs={24} sm={12} lg={6}>
							<Form.Item name='idQuyetDinh' label='Quyết Định'>
								<Select
									placeholder='Chọn quyết định'
									allowClear
									options={quyetDinh.map((item) => ({
										label: item.soQuyetDinh,
										value: item.id,
									}))}
								/>
							</Form.Item>
						</Col>
						<Col xs={24} sm={12} lg={12}>
							<Form.Item label=' '>
								<Space>
									<Button type='primary' icon={<SearchOutlined />} onClick={handleSearch} size='large'>
										Tìm Kiếm
									</Button>
									<Button onClick={handleReset} size='large'>
										Đặt Lại
									</Button>
								</Space>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Card>

			{hasSearched && (
				<Card style={{ marginBottom: '24px' }}>
					<Row gutter={24}>
						<Col xs={24} sm={12} md={8}>
							<Statistic title='Tổng Kết Quả Tìm Kiếm' value={searchResults.length} valueStyle={{ color: '#1890ff' }} />
						</Col>
						<Col xs={24} sm={12} md={8}>
							<Statistic title='Số Tham Số Tìm Kiếm' value={searchParamCount} valueStyle={{ color: '#52c41a' }} />
						</Col>
						{searchFilters.idQuyetDinh && (
							<Col xs={24} sm={12} md={8}>
								<Statistic
									title='Tổng Lượt Tra Cứu (QĐ)'
									value={getThongKeTraCuu(searchFilters.idQuyetDinh)?.tongSoLuotTraCuu || 0}
									valueStyle={{ color: '#faad14' }}
								/>
							</Col>
						)}
					</Row>
				</Card>
			)}

			<Card title='Kết Quả Tìm Kiếm'>
				{hasSearched ? (
					<Table
						columns={columns as any}
						dataSource={searchResults}
						rowKey='id'
						pagination={{ pageSize: 10 }}
						scroll={{ x: 1200 }}
						locale={{
							emptyText: <Empty description='Không tìm thấy kết quả' style={{ marginTop: '48px' }} />,
						}}
					/>
				) : (
					<Empty description='Sử dụng tìm kiếm để xem kết quả' style={{ marginTop: '48px' }} />
				)}
			</Card>

			<Modal
				title='Chi Tiết Văn Bằng'
				visible={isDetailDrawerVisible}
				onCancel={() => setIsDetailDrawerVisible(false)}
				width={800}
				footer={[
					<Button key='close' onClick={() => setIsDetailDrawerVisible(false)}>
						Đóng
					</Button>,
				]}
			>
				{selectedRecord && (
					<div>
						<Card style={{ marginBottom: '16px' }} title='Thông Tin Cơ Bản'>
							<Row gutter={[16, 16]}>
								<Col span={12}>
									<p>
										<strong>Số Vào Sổ:</strong> {selectedRecord.soVaoSo}
									</p>
								</Col>
								<Col span={12}>
									<p>
										<strong>Số Hiệu Văn Bằng:</strong> {selectedRecord.soHieuVanBang}
									</p>
								</Col>
								<Col span={12}>
									<p>
										<strong>Mã Sinh Viên:</strong> {selectedRecord.maSinhVien}
									</p>
								</Col>
								<Col span={12}>
									<p>
										<strong>Họ Tên:</strong> {selectedRecord.hoTen}
									</p>
								</Col>
								<Col span={12}>
									<p>
										<strong>Ngày Sinh:</strong> {moment(selectedRecord.ngaySinh, 'YYYY-MM-DD').format('DD/MM/YYYY')}
									</p>
								</Col>
								<Col span={12}>
									<p>
										<strong>Trạng Thái:</strong>{' '}
										<Tag
											color={
												selectedRecord.trangThai === 'da_cap'
													? 'purple'
													: selectedRecord.trangThai === 'hoan_thanh'
													? 'green'
													: 'blue'
											}
										>
											{selectedRecord.trangThai === 'da_cap'
												? 'Đã cấp'
												: selectedRecord.trangThai === 'hoan_thanh'
												? 'Hoàn thành'
												: 'Nhập'}
										</Tag>
									</p>
								</Col>
							</Row>
						</Card>

						<Card style={{ marginBottom: '16px' }} title='Quyết Định & Sổ Văn Bằng'>
							{(() => {
								const qd = getQuyetDinhInfo(selectedRecord.idQuyetDinh);
								const so = getSoVanBangInfo(selectedRecord.idSoVanBang);
								return (
									<Row gutter={[16, 16]}>
										<Col span={24}>
											<p>
												<strong>Số Quyết Định:</strong> {qd?.soQuyetDinh}
											</p>
										</Col>
										<Col span={24}>
											<p>
												<strong>Ngày Ban Hành QĐ:</strong> {moment(qd?.ngayBanHanh, 'YYYY-MM-DD').format('DD/MM/YYYY')}
											</p>
										</Col>
										<Col span={24}>
											<p>
												<strong>Trích Yếu:</strong>
											</p>
											<p style={{ marginLeft: '16px', fontStyle: 'italic' }}>{qd?.trichYeu}</p>
										</Col>
										<Col span={24}>
											<Divider />
										</Col>
										<Col span={24}>
											<p>
												<strong>Sổ Văn Bằng:</strong> {so?.soHieuSo}
											</p>
										</Col>
										<Col span={24}>
											<p>
												<strong>Năm:</strong> {so?.nam}
											</p>
										</Col>
										<Col span={24}>
											<p>
												<strong>Ngày Mở Sổ:</strong> {moment(so?.ngayMo).format('DD/MM/YYYY')}
											</p>
										</Col>
									</Row>
								);
							})()}
						</Card>

						<Card style={{ marginBottom: '16px' }} title='Dữ Liệu Biểu Mẫu'>
							{Object.keys(selectedRecord.duLieuThemThem).length > 0 ? (
								<Row gutter={[16, 16]}>
									{Object.entries(selectedRecord.duLieuThemThem).map(([key, value]) => (
										<Col span={24} key={key}>
											<p>
												<strong>{key}:</strong> {String(value)}
											</p>
										</Col>
									))}
								</Row>
							) : (
								<p style={{ color: '#999' }}>Không có dữ liệu biểu mẫu</p>
							)}
						</Card>

						<Card style={{ marginBottom: '16px' }} title='Thống Kê Tra Cứu'>
							{selectedQuyetDinhThongKe ? (
								<Row gutter={[16, 16]}>
									<Col span={24}>
										<Statistic
											title='Tổng Lượt Tra Cứu (Quyết Định)'
											value={selectedQuyetDinhThongKe.tongSoLuotTraCuu}
											valueStyle={{ color: '#faad14' }}
										/>
									</Col>
									<Col span={24}>
										<p>
											<strong>Ngày Cập Nhật Thống Kê:</strong>{' '}
											{moment(selectedQuyetDinhThongKe.ngayCapNhat).format('DD/MM/YYYY HH:mm')}
										</p>
									</Col>
								</Row>
							) : (
								<p style={{ color: '#999' }}>Chưa có thống kê tra cứu</p>
							)}
						</Card>

						<Card title='Thông Tin Hệ Thống'>
							<Row gutter={[16, 16]}>
								<Col span={24}>
									<p>
										<strong>Ngày Tạo:</strong> {moment(selectedRecord.ngayTao).format('DD/MM/YYYY HH:mm')}
									</p>
								</Col>
								{selectedRecord.ngayCapNhat && (
									<Col span={24}>
										<p>
											<strong>Ngày Cập Nhật:</strong> {moment(selectedRecord.ngayCapNhat).format('DD/MM/YYYY HH:mm')}
										</p>
									</Col>
								)}
								{selectedRecord.ghiChu && (
									<Col span={24}>
										<p>
											<strong>Ghi Chú:</strong> {selectedRecord.ghiChu}
										</p>
									</Col>
								)}
							</Row>
						</Card>
					</div>
				)}
			</Modal>
		</Card>
	);
};

export default TraCuuVanBang;
