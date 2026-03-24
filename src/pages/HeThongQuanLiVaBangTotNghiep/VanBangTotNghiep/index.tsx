import React, { useState, useMemo } from 'react';
import {
	Table,
	Button,
	Space,
	Modal,
	Form,
	Input,
	Select,
	message,
	Card,
	Popconfirm,
	Row,
	Col,
	Drawer,
	Divider,
	Tag,
	DatePicker,
	Collapse,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { QuanLyVanBang } from '@/models/quanlyvanbang';
import useDocumentManagementSystem from '@/models/quanlyvanbang';

const VanBangTotNghiep: React.FC = () => {
	const { vanBang, soVanBang, quyetDinh, bieuMau, themVanBang, capNhatVanBang, xoaVanBang } =
		useDocumentManagementSystem();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isDetailDrawerVisible, setIsDetailDrawerVisible] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [selectedRecord, setSelectedRecord] = useState<QuanLyVanBang.ThongTinVanBang | null>(null);
	const [form] = Form.useForm();
	const [selectedQuyetDinh, setSelectedQuyetDinh] = useState<string | null>(null);
	const [selectedSoVanBang, setSelectedSoVanBang] = useState<string | null>(null);

	const selectedBieuMauData = useMemo(() => {
		const qd = quyetDinh.find((q) => q.id === selectedQuyetDinh);
		if (!qd) return null;
		return bieuMau.length > 0 ? bieuMau[0] : null;
	}, [selectedQuyetDinh, quyetDinh, bieuMau]);

	const handleOpenModal = (record?: QuanLyVanBang.ThongTinVanBang) => {
		if (record) {
			setEditingId(record.id);
			const qd = quyetDinh.find((q) => q.id === record.idQuyetDinh);
			setSelectedQuyetDinh(record.idQuyetDinh);
			setSelectedSoVanBang(record.idSoVanBang);

			form.setFieldsValue({
				soHieuVanBang: record.soHieuVanBang,
				maSinhVien: record.maSinhVien,
				hoTen: record.hoTen,
				ngaySinh: moment(record.ngaySinh, 'YYYY-MM-DD'),
				idQuyetDinh: record.idQuyetDinh,
				trangThai: record.trangThai,
				ghiChu: record.ghiChu,
				...record.duLieuThemThem,
			});
		} else {
			setEditingId(null);
			setSelectedQuyetDinh(null);
			setSelectedSoVanBang(null);
			form.resetFields();
		}
		setIsModalVisible(true);
	};

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();

			if (!selectedQuyetDinh || !selectedSoVanBang) {
				message.error('Vui lòng chọn quyết định và sổ văn bằng');
				return;
			}

			const duLieuThemThem: Record<string, any> = {};
			if (selectedBieuMauData) {
				selectedBieuMauData.cacTruong.forEach((field) => {
					if (values[field.id]) {
						duLieuThemThem[field.tenTruong] = values[field.id];
					}
				});
			}

			const baseData = {
				soHieuVanBang: values.soHieuVanBang,
				maSinhVien: values.maSinhVien,
				hoTen: values.hoTen,
				ngaySinh: values.ngaySinh?.format('YYYY-MM-DD') || '',
				idQuyetDinh: selectedQuyetDinh,
				idSoVanBang: selectedSoVanBang,
				duLieuThemThem,
				trangThai: values.trangThai || 'nhap',
				ghiChu: values.ghiChu,
			};

			if (editingId) {
				const success = capNhatVanBang(editingId, baseData);

				if (success) {
					message.success('Cập nhật văn bằng thành công');
					setIsModalVisible(false);
				} else {
					message.error('Cập nhật văn bằng thất bại');
				}
			} else {
				const success = themVanBang(baseData as any);

				if (success) {
					message.success('Thêm văn bằng thành công');
					setIsModalVisible(false);
				} else {
					message.error('Thêm văn bằng thất bại');
				}
			}
		} catch (error) {
			message.error('Vui lòng kiểm tra lại thông tin');
		}
	};

	const handleDelete = (id: string) => {
		if (xoaVanBang(id)) {
			message.success('Xóa văn bằng thành công');
		} else {
			message.error('Xóa văn bằng thất bại');
		}
	};

	const handleViewDetail = (record: QuanLyVanBang.ThongTinVanBang) => {
		setSelectedRecord(record);
		setIsDetailDrawerVisible(true);
	};

	const getQuyetDinhName = (id: string) => {
		const qd = quyetDinh.find((q) => q.id === id);
		return qd ? qd.soQuyetDinh : 'N/A';
	};

	const columns = [
		{
			title: 'Số Vào Sổ',
			dataIndex: 'soVaoSo',
			key: 'soVaoSo',
			sorter: (a: any, b: any) => a.soVaoSo - b.soVaoSo,
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
			render: (text: string) => getQuyetDinhName(text),
			align: 'center' as const,
		},
		{
			title: 'Trạng Thái',
			dataIndex: 'trangThai',
			key: 'trangThai',
			render: (text: string) => {
				const statusMap: Record<string, { color: string; label: string }> = {
					nhap: { color: 'blue', label: 'Nhập' },
					hoan_thanh: { color: 'green', label: 'Hoàn thành' },
					da_cap: { color: 'purple', label: 'Đã cấp' },
				};
				return <Tag color={statusMap[text]?.color}>{statusMap[text]?.label}</Tag>;
			},
			align: 'center' as const,
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_: any, record: QuanLyVanBang.ThongTinVanBang) => (
				<Space size='middle'>
					<Button type='text' icon={<EyeOutlined />} onClick={() => handleViewDetail(record)} title='Xem chi tiết' />
					<Button type='text' icon={<EditOutlined />} onClick={() => handleOpenModal(record)} title='Chỉnh sửa' />
					<Popconfirm title='Xóa văn bằng' onConfirm={() => handleDelete(record.id)} okText='Có' cancelText='Không'>
						<Button type='text' danger icon={<DeleteOutlined />} title='Xóa' />
					</Popconfirm>
				</Space>
			),
			align: 'center' as const,
		},
	];

	return (
		<Card>
			<Row justify='space-between' align='middle' style={{ marginBottom: '16px' }}>
				<Col>
					<h2>Quản lý Văn Bằng Tốt Nghiệp</h2>
				</Col>
				<Col>
					<Button type='primary' icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
						Thêm văn bằng
					</Button>
				</Col>
			</Row>

			<Table
				columns={columns as any}
				dataSource={vanBang}
				rowKey='id'
				pagination={{ pageSize: 10 }}
				scroll={{ x: 1400 }}
			/>

			<Modal
				title={editingId ? 'Chỉnh sửa văn bằng' : 'Thêm văn bằng tốt nghiệp'}
				visible={isModalVisible}
				onOk={handleSubmit}
				onCancel={() => setIsModalVisible(false)}
				width={700}
				className='modal-full-form'
			>
				<Form form={form} layout='vertical' scrollToFirstError>
					<Collapse defaultActiveKey={['1']}>
						<Collapse.Panel key='1' header='Thông tin cơ bản (*)'>
							<div>
								<Form.Item
									name='idQuyetDinh'
									label='Quyết Định Tốt Nghiệp'
									rules={[
										{
											required: true,
											message: 'Vui lòng chọn quyết định',
										},
									]}
								>
									<Select
										placeholder='Chọn quyết định'
										onChange={(value) => {
											setSelectedQuyetDinh(value);
											const qd = quyetDinh.find((q) => q.id === value);
											if (qd) {
												setSelectedSoVanBang(qd.idSoVanBang);
											}
										}}
										options={quyetDinh.map((item) => ({
											label: item.soQuyetDinh,
											value: item.id,
										}))}
									/>
								</Form.Item>

								{selectedQuyetDinh && (
									<Form.Item name='idSoVanBang' label='Sổ Văn Bằng' initialValue={selectedSoVanBang}>
										<Select
											disabled
											options={soVanBang
												.filter((s) => s.id === selectedSoVanBang)
												.map((item) => ({
													label: `${item.soHieuSo} - Năm ${item.nam}`,
													value: item.id,
												}))}
										/>
									</Form.Item>
								)}

								<Form.Item
									name='soHieuVanBang'
									label='Số Hiệu Văn Bằng'
									rules={[
										{
											required: true,
											message: 'Vui lòng nhập số hiệu văn bằng',
										},
									]}
								>
									<Input placeholder='VD: VB-2024-001-001' />
								</Form.Item>

								<Form.Item
									name='maSinhVien'
									label='Mã Sinh Viên'
									rules={[
										{
											required: true,
											message: 'Vui lòng nhập mã sinh viên',
										},
									]}
								>
									<Input placeholder='VD: STU2024001' />
								</Form.Item>

								<Form.Item
									name='hoTen'
									label='Họ Tên'
									rules={[
										{
											required: true,
											message: 'Vui lòng nhập họ tên',
										},
									]}
								>
									<Input placeholder='Nhập họ tên sinh viên' />
								</Form.Item>

								<Form.Item
									name='ngaySinh'
									label='Ngày Sinh'
									rules={[
										{
											required: true,
											message: 'Vui lòng chọn ngày sinh',
										},
									]}
								>
									<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
								</Form.Item>
							</div>
						</Collapse.Panel>
						<Collapse.Panel key='2' header='Thông tin biểu mẫu'>
							<div>
								{selectedBieuMauData && selectedBieuMauData.cacTruong.length > 0 ? (
									selectedBieuMauData.cacTruong.map((field) => (
										<Form.Item
											key={field.id}
											name={field.id}
											label={`${field.tenTruong}${field.batBuoc ? ' (*)' : ''}`}
											rules={
												field.batBuoc
													? [
															{
																required: true,
																message: `Vui lòng nhập ${field.tenTruong}`,
															},
													  ]
													: []
											}
										>
											{field.kieuDuLieu === 'date' ? (
												<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
											) : field.kieuDuLieu === 'number' ? (
												<Input type='number' placeholder={field.tenTruong} />
											) : field.kieuDuLieu === 'select' ? (
												<Select
													placeholder={field.tenTruong}
													options={field.options?.map((opt) => ({
														label: opt,
														value: opt,
													}))}
												/>
											) : (
												<Input placeholder={field.tenTruong} />
											)}
										</Form.Item>
									))
								) : (
									<p style={{ color: '#999' }}>Không có trường thông tin cấu hình cho biểu mẫu này</p>
								)}
							</div>
						</Collapse.Panel>
						<Collapse.Panel key='3' header='Thông tin khác'>
							<div>
								<Form.Item name='trangThai' label='Trạng Thái' initialValue='nhap'>
									<Select
										options={[
											{ label: 'Nhập', value: 'nhap' },
											{
												label: 'Hoàn thành',
												value: 'hoan_thanh',
											},
											{ label: 'Đã cấp', value: 'da_cap' },
										]}
									/>
								</Form.Item>

								<Form.Item name='ghiChu' label='Ghi Chú'>
									<Input.TextArea placeholder='Nhập ghi chú...' rows={3} />
								</Form.Item>
							</div>
						</Collapse.Panel>
					</Collapse>
				</Form>
			</Modal>

			<Modal
				title='Chi tiết văn bằng'
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
						<Collapse defaultActiveKey={['1']}>
							<Collapse.Panel key='1' header='Thông tin cơ bản'>
								<Row gutter={[16, 16]}>
									<Col span={24}>
										<p>
											<strong>Số Vào Sổ:</strong> {selectedRecord.soVaoSo}
										</p>
									</Col>
									<Col span={24}>
										<p>
											<strong>Số Hiệu Văn Bằng:</strong> {selectedRecord.soHieuVanBang}
										</p>
									</Col>
									<Col span={24}>
										<p>
											<strong>Mã Sinh Viên:</strong> {selectedRecord.maSinhVien}
										</p>
									</Col>
									<Col span={24}>
										<p>
											<strong>Họ Tên:</strong> {selectedRecord.hoTen}
										</p>
									</Col>
									<Col span={24}>
										<p>
											<strong>Ngày Sinh:</strong> {moment(selectedRecord.ngaySinh, 'YYYY-MM-DD').format('DD/MM/YYYY')}
										</p>
									</Col>
								</Row>
							</Collapse.Panel>
							<Collapse.Panel key='2' header='Quyết định và Sổ'>
								<Row gutter={[16, 16]}>
									<Col span={24}>
										<p>
											<strong>Quyết Định:</strong> {getQuyetDinhName(selectedRecord.idQuyetDinh)}
										</p>
									</Col>
									<Col span={24}>
										<p>
											<strong>Sổ Văn Bằng:</strong>{' '}
											{soVanBang.find((s) => s.id === selectedRecord.idSoVanBang)?.soHieuSo}
										</p>
									</Col>
								</Row>
							</Collapse.Panel>
							<Collapse.Panel key='3' header='Dữ liệu biểu mẫu'>
								<Row gutter={[16, 16]}>
									{Object.entries(selectedRecord.duLieuThemThem).map(([key, value]) => (
										<Col span={24} key={key}>
											<p>
												<strong>{key}:</strong> {String(value)}
											</p>
										</Col>
									))}
								</Row>
							</Collapse.Panel>
							<Collapse.Panel key='4' header='Trạng thái'>
								<Row gutter={[16, 16]}>
									<Col span={24}>
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
									<Col span={24}>
										<p>
											<strong>Ghi Chú:</strong> {selectedRecord.ghiChu || 'Không có'}
										</p>
									</Col>
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
								</Row>
							</Collapse.Panel>
						</Collapse>
					</div>
				)}
			</Modal>
		</Card>
	);
};

export default VanBangTotNghiep;
