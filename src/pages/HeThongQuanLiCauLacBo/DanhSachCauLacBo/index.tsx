import React, { useState } from 'react';
import {
	Table,
	Button,
	Space,
	Tag,
	Modal,
	Form,
	Input,
	Select,
	message,
	Card,
	Popconfirm,
	Row,
	Col,
	Switch,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, TeamOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { QuanLyCauLacBo } from '@/models/quanlyclb';
import useQuanLyCauLacBo from '@/models/quanlyclb';

const DanhSachCauLacBo: React.FC = () => {
	const { cauLacBo, thanhVien, themCauLacBo, capNhatCauLacBo, xoaCauLacBo, getDanhSachThanhVienCLB } =
		useQuanLyCauLacBo();

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isDetailDrawerVisible, setIsDetailDrawerVisible] = useState(false);
	const [isMemberDrawerVisible, setIsMemberDrawerVisible] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [selectedRecord, setSelectedRecord] = useState<QuanLyCauLacBo.CauLacBo | null>(null);
	const [selectedCLBForMembers, setSelectedCLBForMembers] = useState<QuanLyCauLacBo.CauLacBo | null>(null);
	const [form] = Form.useForm();
	const [searchText, setSearchText] = useState('');
	const [filterActive, setFilterActive] = useState<boolean | null>(null);

	const handleOpenModal = (record?: QuanLyCauLacBo.CauLacBo) => {
		if (record) {
			setEditingId(record.id);
			form.setFieldsValue({
				tenCLB: record.tenCLB,
				anhDaiDien: record.anhDaiDien,
				ngayThanhLap: moment(record.ngayThanhLap),
				moTa: record.moTa,
				chuNhiemCLB: record.chuNhiemCLB,
				hoatDong: record.hoatDong,
				ghiChu: record.ghiChu,
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
				const success = capNhatCauLacBo(editingId, {
					...values,
					ngayThanhLap: values.ngayThanhLap?.valueOf() || Date.now(),
				});

				if (success) {
					message.success('Cập nhật câu lạc bộ thành công');
					setIsModalVisible(false);
				} else {
					message.error('Cập nhật câu lạc bộ thất bại');
				}
			} else {
				const success = themCauLacBo({
					...values,
					ngayThanhLap: values.ngayThanhLap?.valueOf() || Date.now(),
				});

				if (success) {
					message.success('Thêm câu lạc bộ thành công');
					setIsModalVisible(false);
				} else {
					message.error('Thêm câu lạc bộ thất bại');
				}
			}
		} catch (error) {
			message.error('Vui lòng kiểm tra lại thông tin');
		}
	};

	const handleDelete = (id: string) => {
		if (xoaCauLacBo(id)) {
			message.success('Xóa câu lạc bộ thành công');
		} else {
			message.error('Xóa câu lạc bộ thất bại');
		}
	};

	const handleViewDetail = (record: QuanLyCauLacBo.CauLacBo) => {
		setSelectedRecord(record);
		setIsDetailDrawerVisible(true);
	};

	const handleViewMembers = (record: QuanLyCauLacBo.CauLacBo) => {
		setSelectedCLBForMembers(record);
		setIsMemberDrawerVisible(true);
	};

	const filteredData = cauLacBo.filter((clb) => {
		const matchSearch =
			clb.tenCLB.toLowerCase().includes(searchText.toLowerCase()) ||
			clb.chuNhiemCLB.toLowerCase().includes(searchText.toLowerCase());
		const matchFilter = filterActive === null || clb.hoatDong === filterActive;
		return matchSearch && matchFilter;
	});

	const columns = [
		{
			title: 'Ảnh đại diện',
			dataIndex: 'anhDaiDien',
			key: 'anhDaiDien',
			render: (text: string) => (
				<div style={{ width: '50px', height: '50px', overflow: 'hidden', borderRadius: '4px' }}>
					{text ? (
						<img src={text} alt='CLB' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
					) : (
						<div
							style={{
								width: '100%',
								height: '100%',
								backgroundColor: '#f0f0f0',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							N/A
						</div>
					)}
				</div>
			),
			width: 80,
		},
		{
			title: 'Tên câu lạc bộ',
			dataIndex: 'tenCLB',
			key: 'tenCLB',
			sorter: (a: any, b: any) => a.tenCLB.localeCompare(b.tenCLB),
			align: 'center' as const,
		},
		{
			title: 'Ngày thành lập',
			dataIndex: 'ngayThanhLap',
			key: 'ngayThanhLap',
			render: (text: number) => moment(text).format('DD/MM/YYYY'),
			sorter: (a: any, b: any) => a.ngayThanhLap - b.ngayThanhLap,
			align: 'center' as const,
		},
		{
			title: 'Mô tả',
			dataIndex: 'moTa',
			key: 'moTa',
			ellipsis: true,
			render: (text: string) => <div dangerouslySetInnerHTML={{ __html: text }} style={{ maxWidth: '200px' }} />,
			align: 'center' as const,
		},
		{
			title: 'Chủ nhiệm CLB',
			dataIndex: 'chuNhiemCLB',
			key: 'chuNhiemCLB',
			align: 'center' as const,
		},
		{
			title: 'Số thành viên',
			dataIndex: 'id',
			key: 'members',
			render: (id: string) => {
				const members = thanhVien.filter((m) => m.idCauLacBo === id);
				return <Tag color='blue'>{members.length}</Tag>;
			},
			align: 'center' as const,
		},
		{
			title: 'Hoạt động',
			dataIndex: 'hoatDong',
			key: 'hoatDong',
			render: (text: boolean) => <Tag color={text ? 'green' : 'red'}>{text ? 'Có' : 'Không'}</Tag>,
			sorter: (a: any, b: any) => (a.hoatDong === b.hoatDong ? 0 : a.hoatDong ? -1 : 1),
			align: 'center' as const,
		},
		{
			title: 'Hành động',
			key: 'action',
			width: 180,
			render: (_: any, record: QuanLyCauLacBo.CauLacBo) => (
				<Space size='small'>
					<Button
						type='text'
						size='small'
						icon={<EyeOutlined />}
						onClick={() => handleViewDetail(record)}
						title='Xem chi tiết'
					/>
					<Button
						type='text'
						size='small'
						icon={<TeamOutlined />}
						onClick={() => handleViewMembers(record)}
						title='Xem thành viên'
					/>
					<Button
						type='text'
						size='small'
						icon={<EditOutlined />}
						onClick={() => handleOpenModal(record)}
						title='Chỉnh sửa'
					/>
					<Popconfirm
						title='Xóa câu lạc bộ này?'
						okText='Có'
						cancelText='Không'
						onConfirm={() => handleDelete(record.id)}
					>
						<Button type='text' danger size='small' icon={<DeleteOutlined />} title='Xóa' />
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
					<h2>Danh sách câu lạc bộ</h2>
				</Col>
				<Col>
					<Button type='primary' icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
						Thêm câu lạc bộ
					</Button>
				</Col>
			</Row>

			<Row gutter={16} style={{ marginBottom: '16px' }}>
				<Col span={12}>
					<Input
						placeholder='Tìm kiếm theo tên hoặc chủ nhiệm CLB...'
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
					/>
				</Col>
				<Col span={12}>
					<Select
						placeholder='Lọc theo trạng thái hoạt động'
						allowClear
						value={filterActive}
						onChange={(value) => setFilterActive(value)}
						style={{ width: '100%' }}
						options={[
							{ label: 'Đang hoạt động', value: true },
							{ label: 'Không hoạt động', value: false },
						]}
					/>
				</Col>
			</Row>

			<Table
				columns={columns as any}
				dataSource={filteredData}
				rowKey='id'
				pagination={{ pageSize: 10 }}
				scroll={{ x: 1400 }}
			/>

			<Modal
				title={editingId ? 'Chỉnh sỚ câu lạc bộ' : 'Thêm câu lạc bộ'}
				visible={isModalVisible}
				onOk={handleSubmit}
				onCancel={() => setIsModalVisible(false)}
				width={700}
			>
				<Form form={form} layout='vertical'>
					<Form.Item
						name='tenCLB'
						label='Tên câu lạc bộ'
						rules={[{ required: true, message: 'Vui lòng nhập tên câu lạc bộ' }]}
					>
						<Input placeholder='VD: CLB Công nghệ thông tin' />
					</Form.Item>

					<Form.Item name='anhDaiDien' label='Ảnh đại diện (URL)'>
						<Input placeholder='https://example.com/image.jpg' />
					</Form.Item>

					<Form.Item
						name='ngayThanhLap'
						label='Ngày thành lập'
						rules={[{ required: true, message: 'Vui lòng chọn ngày thành lập' }]}
					>
						<Input type='date' />
					</Form.Item>

					<Form.Item name='moTa' label='Mô tả (HTML)' rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
						<Input.TextArea rows={4} placeholder='Nhập mô tả về câu lạc bộ (hỗ trợ HTML)' />
					</Form.Item>

					<Form.Item
						name='chuNhiemCLB'
						label='Chủ nhiệm CLB'
						rules={[{ required: true, message: 'Vui lòng nhập chủ nhiệm CLB' }]}
					>
						<Input placeholder='VD: Ths. Nguyễn Văn A' />
					</Form.Item>

					<Form.Item name='hoatDong' label='Hoạt động' valuePropName='checked' initialValue={true}>
						<Switch />
					</Form.Item>

					<Form.Item name='ghiChu' label='Ghi chú'>
						<Input.TextArea rows={2} placeholder='Ghi chú thêm' />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title='Chi tiết câu lạc bộ'
				visible={isDetailDrawerVisible}
				onCancel={() => setIsDetailDrawerVisible(false)}
				footer={null}
				width={600}
			>
				{selectedRecord && (
					<div>
						{selectedRecord.anhDaiDien && (
							<img
								src={selectedRecord.anhDaiDien}
								alt='CLB'
								style={{ width: '30%', maxHeight: '300px', objectFit: 'cover', marginBottom: '16px' }}
							/>
						)}
						<dl style={{ marginBottom: '12px' }}>
							<dt>
								<strong>Tên câu lạc bộ:</strong>
							</dt>
							<dd>{selectedRecord.tenCLB}</dd>

							<dt>
								<strong>Ngày thành lập:</strong>
							</dt>
							<dd>{moment(selectedRecord.ngayThanhLap).format('DD/MM/YYYY')}</dd>

							<dt>
								<strong>Chủ nhiệm CLB:</strong>
							</dt>
							<dd>{selectedRecord.chuNhiemCLB}</dd>

							<dt>
								<strong>Mô tả:</strong>
							</dt>
							<dd dangerouslySetInnerHTML={{ __html: selectedRecord.moTa }} />

							<dt>
								<strong>Hoạt động:</strong>
							</dt>
							<dd>{selectedRecord.hoatDong ? 'Có' : 'Không'}</dd>

							<dt>
								<strong>Ghi chú:</strong>
							</dt>
							<dd>{selectedRecord.ghiChu || 'N/A'}</dd>

							<dt>
								<strong>Ngày tạo:</strong>
							</dt>
							<dd>{selectedRecord.ngayTao ? moment(selectedRecord.ngayTao).format('DD/MM/YYYY HH:mm:ss') : 'N/A'}</dd>

							<dt>
								<strong>Ngày cập nhật:</strong>
							</dt>
							<dd>
								{selectedRecord.ngayCapNhat ? moment(selectedRecord.ngayCapNhat).format('DD/MM/YYYY HH:mm:ss') : 'N/A'}
							</dd>
						</dl>
					</div>
				)}
			</Modal>

			<Modal
				title={`Danh sách thành viên - ${selectedCLBForMembers?.tenCLB}`}
				visible={isMemberDrawerVisible}
				onCancel={() => setIsMemberDrawerVisible(false)}
				footer={null}
				width={700}
			>
				{selectedCLBForMembers && (
					<Table
						columns={[
							{
								title: 'Họ tên',
								dataIndex: 'hoTen',
								key: 'hoTen',
								align: 'center' as const,
							},
							{
								title: 'Email',
								dataIndex: 'email',
								key: 'email',
								align: 'center' as const,
							},
							{
								title: 'Số điện thoại',
								dataIndex: 'soDienThoai',
								key: 'soDienThoai',
								align: 'center' as const,
							},
							{
								title: 'Trạng thái',
								dataIndex: 'trangThaiThanhVien',
								key: 'trangThaiThanhVien',
								render: (text: string) => {
									const statusMap: Record<string, { color: string; label: string }> = {
										active: { color: 'green', label: 'Hoạt động' },
										inactive: { color: 'orange', label: 'Không hoạt động' },
										suspended: { color: 'red', label: 'Tạm dừng' },
									};
									return <Tag color={statusMap[text]?.color}>{statusMap[text]?.label}</Tag>;
								},
								align: 'center' as const,
							},
						]}
						dataSource={getDanhSachThanhVienCLB(selectedCLBForMembers.id)}
						rowKey='id'
						pagination={{ pageSize: 10 }}
						scroll={{ x: 500 }}
					/>
				)}
			</Modal>
		</Card>
	);
};

export default DanhSachCauLacBo;
