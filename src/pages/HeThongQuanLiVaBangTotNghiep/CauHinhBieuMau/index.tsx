import React, { useState } from 'react';
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
	Collapse,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { QuanLyVanBang } from '@/models/quanlyvanbang';
import useDocumentManagementSystem from '@/models/quanlyvanbang';

const CauHinhBieuMau: React.FC = () => {
	const { bieuMau, themBieuMau, capNhatBieuMau, xoaBieuMau, themTruongThongTin, xoaTruongThongTin } =
		useDocumentManagementSystem();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isDetailDrawerVisible, setIsDetailDrawerVisible] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [selectedRecord, setSelectedRecord] = useState<QuanLyVanBang.BieuMauVanBang | null>(null);
	const [isAddFieldModalVisible, setIsAddFieldModalVisible] = useState(false);
	const [addFieldBieuMauId, setAddFieldBieuMauId] = useState<string | null>(null);
	const [form] = Form.useForm();
	const [fieldForm] = Form.useForm();

	const handleOpenModal = (record?: QuanLyVanBang.BieuMauVanBang) => {
		if (record) {
			setEditingId(record.id);
			form.setFieldsValue({
				tenBieuMau: record.tenBieuMau,
				moTa: record.moTa,
			});
		} else {
			setEditingId(null);
			form.resetFields();
		}
		setIsModalVisible(true);
	};

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();

			if (editingId) {
				const success = capNhatBieuMau(editingId, {
					tenBieuMau: values.tenBieuMau,
					moTa: values.moTa,
				});

				if (success) {
					message.success('Cập nhật biểu mẫu thành công');
					setIsModalVisible(false);
				} else {
					message.error('Cập nhật biểu mẫu thất bại');
				}
			} else {
				const success = themBieuMau({
					tenBieuMau: values.tenBieuMau,
					moTa: values.moTa,
					cacTruong: [],
				});

				if (success) {
					message.success('Thêm biểu mẫu thành công');
					setIsModalVisible(false);
				} else {
					message.error('Thêm biểu mẫu thất bại');
				}
			}
		} catch (error) {
			message.error('Vui lòng kiểm tra lại thông tin');
		}
	};

	const handleDelete = (id: string) => {
		if (xoaBieuMau(id)) {
			message.success('Xóa biểu mẫu thành công');
		} else {
			message.error('Xóa biểu mẫu thất bại');
		}
	};

	const handleViewDetail = (record: QuanLyVanBang.BieuMauVanBang) => {
		setSelectedRecord(record);
		setIsDetailDrawerVisible(true);
	};

	const handleAddField = (bieuMauId: string) => {
		setAddFieldBieuMauId(bieuMauId);
		fieldForm.resetFields();
		setIsAddFieldModalVisible(true);
	};

	const handleAddFieldSubmit = async () => {
		try {
			const values = await fieldForm.validateFields();

			if (addFieldBieuMauId) {
				const success = themTruongThongTin(addFieldBieuMauId, {
					tenTruong: values.tenTruong,
					kieuDuLieu: values.kieuDuLieu,
					batBuoc: values.batBuoc || false,
					thuTu: values.thuTu || 0,
					options: values.kieuDuLieu === 'select' ? values.options?.split('\n') : undefined,
					ghiChu: values.ghiChu,
				});

				if (success) {
					message.success('Thêm trường thông tin thành công');
					setIsAddFieldModalVisible(false);
					setSelectedRecord(bieuMau.find((bm) => bm.id === addFieldBieuMauId) || null);
				} else {
					message.error('Thêm trường thông tin thất bại');
				}
			}
		} catch (error) {
			message.error('Vui lòng kiểm tra lại thông tin');
		}
	};

	const handleDeleteField = (bieuMauId: string, fieldId: string) => {
		if (xoaTruongThongTin(bieuMauId, fieldId)) {
			message.success('Xóa trường thông tin thành công');
			setSelectedRecord(bieuMau.find((bm) => bm.id === bieuMauId) || null);
		} else {
			message.error('Xóa trường thông tin thất bại');
		}
	};

	const columns = [
		{
			title: 'Tên Biểu Mẫu',
			dataIndex: 'tenBieuMau',
			key: 'tenBieuMau',
			align: 'center' as const,
		},
		{
			title: 'Số Trường',
			dataIndex: 'cacTruong',
			key: 'cacTruong',
			render: (fields: QuanLyVanBang.TruongThongTin[]) => fields.length,
			align: 'center' as const,
		},
		{
			title: 'Ngày Tạo',
			dataIndex: 'ngayTao',
			key: 'ngayTao',
			render: (text: number) => moment(text).format('DD/MM/YYYY'),
			align: 'center' as const,
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_: any, record: QuanLyVanBang.BieuMauVanBang) => (
				<Space size='middle'>
					<Button type='text' icon={<EyeOutlined />} onClick={() => handleViewDetail(record)} title='Xem chi tiết' />
					<Button type='text' icon={<EditOutlined />} onClick={() => handleOpenModal(record)} title='Chỉnh sửa' />
					<Popconfirm title='Xóa biểu mẫu' onConfirm={() => handleDelete(record.id)} okText='Có' cancelText='Không'>
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
					<h2>Cấu Hình Biểu Mẫu Văn Bằng</h2>
				</Col>
				<Col>
					<Button type='primary' icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
						Thêm biểu mẫu
					</Button>
				</Col>
			</Row>

			<Table
				columns={columns as any}
				dataSource={bieuMau}
				rowKey='id'
				pagination={{ pageSize: 10 }}
				scroll={{ x: 1000 }}
			/>

			<Modal
				title={editingId ? 'Chỉnh sửa biểu mẫu' : 'Thêm biểu mẫu'}
				visible={isModalVisible}
				onOk={handleSubmit}
				onCancel={() => setIsModalVisible(false)}
				width={600}
			>
				<Form form={form} layout='vertical'>
					<Form.Item
						name='tenBieuMau'
						label='Tên Biểu Mẫu'
						rules={[{ required: true, message: 'Vui lòng nhập tên biểu mẫu' }]}
					>
						<Input placeholder='VD: Biểu mẫu Văn Bằng 2024' />
					</Form.Item>

					<Form.Item name='moTa' label='Mô Tả'>
						<Input.TextArea placeholder='Nhập mô tả biểu mẫu...' rows={3} />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title='Thêm Trường Thông Tin'
				visible={isAddFieldModalVisible}
				onOk={handleAddFieldSubmit}
				onCancel={() => setIsAddFieldModalVisible(false)}
				width={600}
			>
				<Form form={fieldForm} layout='vertical'>
					<Form.Item
						name='tenTruong'
						label='Tên Trường'
						rules={[{ required: true, message: 'Vui lòng nhập tên trường' }]}
					>
						<Input placeholder='VD: Dân tộc, Nơi sinh, Điểm trung bình' />
					</Form.Item>

					<Form.Item
						name='kieuDuLieu'
						label='Kiểu Dữ Liệu'
						rules={[{ required: true, message: 'Vui lòng chọn kiểu dữ liệu' }]}
					>
						<Select
							options={[
								{ label: 'Văn bản (String)', value: 'string' },
								{ label: 'Số (Number)', value: 'number' },
								{ label: 'Ngày (Date)', value: 'date' },
								{ label: 'Lựa chọn (Select)', value: 'select' },
							]}
						/>
					</Form.Item>

					<Form.Item
						noStyle
						shouldUpdate={(prevValues, currentValues) => prevValues.kieuDuLieu !== currentValues.kieuDuLieu}
					>
						{({ getFieldValue }) =>
							getFieldValue('kieuDuLieu') === 'select' ? (
								<Form.Item
									name='options'
									label='Các tùy chọn (một dòng một tùy chọn)'
									rules={[{ required: true, message: 'Vui lòng nhập các tùy chọn' }]}
								>
									<Input.TextArea
										placeholder='Option 1&#10;Option 2&#10;Option 3'
										rows={4}
									/>
								</Form.Item>
							) : null
						}
					</Form.Item>

					<Form.Item name='thuTu' label='Thứ Tự'>
						<Input type='number' placeholder='0' />
					</Form.Item>

					<Form.Item name='batBuoc' label='Bắt buộc' valuePropName='checked'>
						<Select
							options={[
								{ label: 'Có', value: true },
								{ label: 'Không', value: false },
							]}
						/>
					</Form.Item>

					<Form.Item name='ghiChu' label='Ghi Chú'>
						<Input.TextArea placeholder='Nhập ghi chú...' rows={2} />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title='Chi tiết biểu mẫu'
				visible={isDetailDrawerVisible}
				onCancel={() => setIsDetailDrawerVisible(false)}
				width={700}
				footer={[
					<Button key='close' onClick={() => setIsDetailDrawerVisible(false)}>
						Đóng
					</Button>,
				]}
			>
				{selectedRecord && (
					<div>
						<Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
							<Col span={24}>
								<p>
									<strong>Tên Biểu Mẫu:</strong> {selectedRecord.tenBieuMau}
								</p>
							</Col>
							<Col span={24}>
								<p>
									<strong>Mô Tả:</strong> {selectedRecord.moTa || 'Không có'}
								</p>
							</Col>
							<Col span={24}>
								<p>
									<strong>Ngày Tạo:</strong> {moment(selectedRecord.ngayTao).format('DD/MM/YYYY HH:mm')}
								</p>
							</Col>
						</Row>

						<Divider />

						<Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
							<Col span={24}>
								<Button
									type='primary'
									onClick={() => handleAddField(selectedRecord.id)}
									style={{ marginBottom: '16px' }}
								>
									Thêm Trường Thông Tin
								</Button>
							</Col>
						</Row>

						<Table
							columns={
								[
									{
										title: 'Tên Trường',
										dataIndex: 'tenTruong',
										key: 'tenTruong',
										width: '30%',
										align: 'center' as const,
									},
									{
										title: 'Kiểu Dữ Liệu',
										dataIndex: 'kieuDuLieu',
										key: 'kieuDuLieu',
										render: (text: string) => {
											const typeMap: Record<string, string> = {
												string: 'Văn bản',
												number: 'Số',
												date: 'Ngày',
												select: 'Lựa chọn',
											};
											return typeMap[text] || text;
										},
										width: '20%',
										align: 'center' as const,
									},
									{
										title: 'Bắt buộc',
										dataIndex: 'batBuoc',
										key: 'batBuoc',
										render: (text: boolean) => (text ? <Tag color='green'>Có</Tag> : <Tag color='red'>Không</Tag>),
										width: '15%',
										align: 'center' as const,
									},
									{
										title: 'Hành động',
										key: 'action',
										render: (_: any, record: QuanLyVanBang.TruongThongTin) => (
											<Popconfirm
												title='Xóa trường'
												onConfirm={() => handleDeleteField(selectedRecord.id, record.id)}
												okText='Có'
												cancelText='Không'
											>
												<Button type='text' danger size='small'>
													Xóa
												</Button>
											</Popconfirm>
										),
										width: '15%',
										align: 'center' as const,
									},
								] as any
							}
							dataSource={selectedRecord.cacTruong}
							rowKey='id'
							pagination={{ pageSize: 5 }}
						/>
					</div>
				)}
			</Modal>
		</Card>
	);
};

export default CauHinhBieuMau;
