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
	Timeline,
} from 'antd';
import {
	PlusOutlined,
	EditOutlined,
	DeleteOutlined,
	EyeOutlined,
	CheckOutlined,
	CloseOutlined,
	HistoryOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import type { QuanLyCauLacBo } from '@/models/quanlyclb';
import useQuanLyCauLacBo from '@/models/quanlyclb';

const QuanLyDonDangKyThanhVien: React.FC = () => {
	const {
		cauLacBo,
		donDangKy,

		themDonDangKy,
		capNhatDonDangKy,
		xoaDonDangKy,
		duyetDonDangKy,
		tuChoiDonDangKy,
		getLichSuThaoTacByDonId,
	} = useQuanLyCauLacBo();

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isDetailDrawerVisible, setIsDetailDrawerVisible] = useState(false);
	const [isHistoryDrawerVisible, setIsHistoryDrawerVisible] = useState(false);
	const [isApprovalModalVisible, setIsApprovalModalVisible] = useState(false);
	const [isRejectionModalVisible, setIsRejectionModalVisible] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [selectedRecord, setSelectedRecord] = useState<QuanLyCauLacBo.DonDangKyThanhVien | null>(null);
	const [form] = Form.useForm();
	const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
	const [rejectionReason, setRejectionReason] = useState('');
	const [searchText, setSearchText] = useState('');
	const [filterStatus, setFilterStatus] = useState<string | null>(null);

	const handleOpenModal = (record?: QuanLyCauLacBo.DonDangKyThanhVien) => {
		if (record) {
			setEditingId(record.id);
			form.setFieldsValue({
				hoTen: record.hoTen,
				email: record.email,
				soDienThoai: record.soDienThoai,
				gioiTinh: record.gioiTinh,
				diaChi: record.diaChi,
				soTruong: record.soTruong,
				idCauLacBo: record.idCauLacBo,
				lyDoDangKy: record.lyDoDangKy,
				trangThai: record.trangThai,
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
				const success = capNhatDonDangKy(editingId, values);

				if (success) {
					message.success('Cập nhật đơn đăng ký thành công');
					setIsModalVisible(false);
				} else {
					message.error('Cập nhật đơn đăng ký thất bại');
				}
			} else {
				const success = themDonDangKy({
					...values,
					trangThai: 'pending',
				});

				if (success) {
					message.success('Thêm đơn đăng ký thành công');
					setIsModalVisible(false);
				} else {
					message.error('Thêm đơn đăng ký thất bại');
				}
			}
		} catch (error) {
			message.error('Vui lòng kiểm tra lại thông tin');
		}
	};

	const handleDelete = (id: string) => {
		if (xoaDonDangKy(id)) {
			message.success('Xóa đơn đăng ký thành công');
		} else {
			message.error('Xóa đơn đăng ký thất bại');
		}
	};

	const handleViewDetail = (record: QuanLyCauLacBo.DonDangKyThanhVien) => {
		setSelectedRecord(record);
		setIsDetailDrawerVisible(true);
	};

	const handleViewHistory = (record: QuanLyCauLacBo.DonDangKyThanhVien) => {
		setSelectedRecord(record);
		setIsHistoryDrawerVisible(true);
	};

	const handleApproveSelected = () => {
		if (selectedRowKeys.length === 0) {
			message.warning('Vui lòng chọn ít nhất một đơn để duyệt');
			return;
		}
		setIsApprovalModalVisible(true);
	};

	const handleApproveConfirm = () => {
		if (duyetDonDangKy(selectedRowKeys, 'Admin')) {
			message.success(`Duyệt ${selectedRowKeys.length} đơn đăng ký thành công`);
			setSelectedRowKeys([]);
			setIsApprovalModalVisible(false);
		} else {
			message.error('Duyệt đơn đăng ký thất bại');
		}
	};

	const handleRejectSelected = () => {
		if (selectedRowKeys.length === 0) {
			message.warning('Vui lòng chọn ít nhất một đơn để từ chối');
			return;
		}
		setIsRejectionModalVisible(true);
	};

	const handleRejectConfirm = async () => {
		if (!rejectionReason.trim()) {
			message.warning('Vui lòng nhập lý do từ chối');
			return;
		}

		if (tuChoiDonDangKy(selectedRowKeys, rejectionReason, 'Admin')) {
			message.success(`Từ chối ${selectedRowKeys.length} đơn đăng ký thành công`);
			setSelectedRowKeys([]);
			setIsRejectionModalVisible(false);
			setRejectionReason('');
		} else {
			message.error('Từ chối đơn đăng ký thất bại');
		}
	};

	const filteredData = donDangKy.filter((don) => {
		const matchSearch =
			don.hoTen.toLowerCase().includes(searchText.toLowerCase()) ||
			don.email.toLowerCase().includes(searchText.toLowerCase()) ||
			don.soDienThoai.includes(searchText);
		const matchFilter = filterStatus === null || don.trangThai === filterStatus;
		return matchSearch && matchFilter;
	});

	const columns = [
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			key: 'hoTen',
			sorter: (a: any, b: any) => a.hoTen.localeCompare(b.hoTen),
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
			title: 'Giới tính',
			dataIndex: 'gioiTinh',
			key: 'gioiTinh',
			render: (text: string) => {
				const map: Record<string, string> = {
					nam: 'Nam',
					nu: 'Nữ',
					khac: 'Khác',
				};
				return map[text];
			},
			align: 'center' as const,
		},
		{
			title: 'Địa chỉ',
			dataIndex: 'diaChi',
			key: 'diaChi',
			ellipsis: true,
			align: 'center' as const,
		},
		{
			title: 'Sở trường',
			dataIndex: 'soTruong',
			key: 'soTruong',
			ellipsis: true,
			align: 'center' as const,
		},
		{
			title: 'Câu lạc bộ',
			dataIndex: 'idCauLacBo',
			key: 'idCauLacBo',
			render: (id: string) => {
				const clb = cauLacBo.find((c) => c.id === id);
				return clb?.tenCLB || 'N/A';
			},
			align: 'center' as const,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			key: 'trangThai',
			render: (text: string) => {
				const statusMap: Record<string, { color: string; label: string }> = {
					pending: { color: 'orange', label: 'Chờ xử lý' },
					approved: { color: 'green', label: 'Đã duyệt' },
					rejected: { color: 'red', label: 'Đã từ chối' },
				};
				return <Tag color={statusMap[text]?.color}>{statusMap[text]?.label}</Tag>;
			},
			sorter: (a: any, b: any) => a.trangThai.localeCompare(b.trangThai),
			align: 'center' as const,
		},
		{
			title: 'Hành động',
			key: 'action',
			width: 200,
			render: (_: any, record: QuanLyCauLacBo.DonDangKyThanhVien) => (
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
						icon={<HistoryOutlined />}
						onClick={() => handleViewHistory(record)}
						title='Xem lịch sử'
					/>
					{record.trangThai === 'pending' && (
						<>
							<Button
								type='text'
								size='small'
								icon={<EditOutlined />}
								onClick={() => handleOpenModal(record)}
								title='Chỉnh sửa'
							/>
							<Popconfirm title='Xóa đơn này?' okText='Có' cancelText='Không' onConfirm={() => handleDelete(record.id)}>
								<Button type='text' danger size='small' icon={<DeleteOutlined />} title='Xóa' />
							</Popconfirm>
						</>
					)}
				</Space>
			),
		},
	];

	return (
		<Card>
			<Row justify='space-between' align='middle' style={{ marginBottom: '16px' }}>
				<Col>
					<h2>Quản lý đơn đăng ký thành viên</h2>
				</Col>
				<Col>
					<Button type='primary' icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
						Thêm đơn đăng ký
					</Button>
				</Col>
			</Row>

			<Row gutter={16} style={{ marginBottom: '16px' }}>
				<Col span={12}>
					<Input
						placeholder='Tìm kiếm theo tên, email hoặc SĐT...'
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
					/>
				</Col>
				<Col span={12}>
					<Select
						placeholder='Lọc theo trạng thái'
						allowClear
						value={filterStatus}
						onChange={(value) => setFilterStatus(value)}
						style={{ width: '100%' }}
						options={[
							{ label: 'Chờ xử lý', value: 'pending' },
							{ label: 'Đã duyệt', value: 'approved' },
							{ label: 'Đã từ chối', value: 'rejected' },
						]}
					/>
				</Col>
			</Row>

			{selectedRowKeys.length > 0 && (
				<Row gutter={16} style={{ marginBottom: '16px' }}>
					<Col>
						<span>Đã chọn {selectedRowKeys.length} đơn</span>
					</Col>
					<Col>
						<Button
							type='primary'
							icon={<CheckOutlined />}
							onClick={handleApproveSelected}
							style={{ backgroundColor: 'green' }}
						>
							Duyệt {selectedRowKeys.length} đơn
						</Button>
					</Col>
					<Col>
						<Button type='primary' danger icon={<CloseOutlined />} onClick={handleRejectSelected}>
							Không duyệt {selectedRowKeys.length} đơn
						</Button>
					</Col>
				</Row>
			)}

			<Table
				columns={columns as any}
				dataSource={filteredData}
				rowKey='id'
				pagination={{ pageSize: 10 }}
				scroll={{ x: 1600 }}
				rowSelection={{
					selectedRowKeys,
					onChange: (keys) => setSelectedRowKeys(keys as string[]),
				}}
			/>

			<Modal
				title={editingId ? 'Chỉnh sửa đơn đăng ký' : 'Thêm đơn đăng ký'}
				visible={isModalVisible}
				onOk={handleSubmit}
				onCancel={() => setIsModalVisible(false)}
				width={700}
			>
				<Form form={form} layout='vertical'>
					<Form.Item name='hoTen' label='Họ tên' rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
						<Input placeholder='VD: Nguyễn Văn A' />
					</Form.Item>

					<Form.Item
						name='email'
						label='Email'
						rules={[
							{ required: true, message: 'Vui lòng nhập email' },
							{ type: 'email', message: 'Email không hợp lệ' },
						]}
					>
						<Input placeholder='example@example.com' />
					</Form.Item>

					<Form.Item
						name='soDienThoai'
						label='Số điện thoại'
						rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
					>
						<Input placeholder='0123456789' />
					</Form.Item>

					<Form.Item name='gioiTinh' label='Giới tính' rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}>
						<Select
							options={[
								{ label: 'Nam', value: 'nam' },
								{ label: 'Nữ', value: 'nu' },
								{ label: 'Khác', value: 'khac' },
							]}
						/>
					</Form.Item>

					<Form.Item name='diaChi' label='Địa chỉ' rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
						<Input placeholder='Nhập địa chỉ' />
					</Form.Item>

					<Form.Item name='soTruong' label='Sở trường' rules={[{ required: true, message: 'Vui lòng nhập sở trường' }]}>
						<Input placeholder='VD: Lập trình, Thiết kế' />
					</Form.Item>

					<Form.Item
						name='idCauLacBo'
						label='Câu lạc bộ'
						rules={[{ required: true, message: 'Vui lòng chọn câu lạc bộ' }]}
					>
						<Select
							placeholder='Chọn câu lạc bộ'
							options={cauLacBo.map((clb) => ({
								label: clb.tenCLB,
								value: clb.id,
							}))}
						/>
					</Form.Item>

					<Form.Item
						name='lyDoDangKy'
						label='Lý do đăng ký'
						rules={[{ required: true, message: 'Vui lòng nhập lý do đăng ký' }]}
					>
						<Input.TextArea rows={3} placeholder='Nhập lý do muốn tham gia câu lạc bộ' />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title='Chi tiết đơn đăng ký'
				visible={isDetailDrawerVisible}
				onCancel={() => setIsDetailDrawerVisible(false)}
				footer={null}
				width={600}
			>
				{selectedRecord && (
					<div>
						<dl style={{ marginBottom: '12px' }}>
							<dt>
								<strong>Họ tên:</strong>
							</dt>
							<dd>{selectedRecord.hoTen}</dd>

							<dt>
								<strong>Email:</strong>
							</dt>
							<dd>{selectedRecord.email}</dd>

							<dt>
								<strong>Số điện thoại:</strong>
							</dt>
							<dd>{selectedRecord.soDienThoai}</dd>

							<dt>
								<strong>Giới tính:</strong>
							</dt>
							<dd>{selectedRecord.gioiTinh === 'nam' ? 'Nam' : selectedRecord.gioiTinh === 'nu' ? 'Nữ' : 'Khác'}</dd>

							<dt>
								<strong>Địa chỉ:</strong>
							</dt>
							<dd>{selectedRecord.diaChi}</dd>

							<dt>
								<strong>Sở trường:</strong>
							</dt>
							<dd>{selectedRecord.soTruong}</dd>

							<dt>
								<strong>Câu lạc bộ:</strong>
							</dt>
							<dd>{cauLacBo.find((c) => c.id === selectedRecord.idCauLacBo)?.tenCLB || 'N/A'}</dd>

							<dt>
								<strong>Lý do đăng ký:</strong>
							</dt>
							<dd>{selectedRecord.lyDoDangKy}</dd>

							<dt>
								<strong>Trạng thái:</strong>
							</dt>
							<dd>
								<Tag
									color={
										selectedRecord.trangThai === 'approved'
											? 'green'
											: selectedRecord.trangThai === 'rejected'
											? 'red'
											: 'orange'
									}
								>
									{selectedRecord.trangThai === 'pending'
										? 'Chờ xử lý'
										: selectedRecord.trangThai === 'approved'
										? 'Đã duyệt'
										: 'Đã từ chối'}
								</Tag>
							</dd>

							<dt>
								<strong>Ghi chú:</strong>
							</dt>
							<dd>{selectedRecord.ghiChu || 'Không có'}</dd>

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
				title='Lịch sử thao tác'
				visible={isHistoryDrawerVisible}
				onCancel={() => setIsHistoryDrawerVisible(false)}
				footer={null}
				width={600}
			>
				{selectedRecord && (
					<Timeline>
						{getLichSuThaoTacByDonId(selectedRecord.id).map((item) => (
							<Timeline.Item
								key={item.id}
								color={item.hanhDong === 'approved' ? 'green' : item.hanhDong === 'rejected' ? 'red' : 'blue'}
							>
								<div>
									<p>
										<strong>
											{item.hanhDong === 'approved'
												? 'Duyệt'
												: item.hanhDong === 'rejected'
												? 'Từ chối'
												: item.hanhDong === 'created'
												? 'Tạo'
												: 'Cập nhật'}
										</strong>
										{' - '}
										{item.tenNguoiThucHien}
									</p>
									<p style={{ color: '#999', fontSize: '12px' }}>
										{moment(item.thoiGianThucHien).format('DD/MM/YYYY HH:mm:ss')}
									</p>
									{item.lyDo && (
										<p>
											<strong>Lý do:</strong> {item.lyDo}
										</p>
									)}
									{item.ghiChu && (
										<p>
											<strong>Ghi chú:</strong> {item.ghiChu}
										</p>
									)}
								</div>
							</Timeline.Item>
						))}
					</Timeline>
				)}
			</Modal>
			<Modal
				title='Xác nhận duyệt đơn'
				visible={isApprovalModalVisible}
				onOk={handleApproveConfirm}
				onCancel={() => setIsApprovalModalVisible(false)}
				okText='Duyệt'
				cancelText='Hủy'
			>
				<p>Bạn có chắc chắn muốn duyệt {selectedRowKeys.length} đơn đăng ký?</p>
			</Modal>

			<Modal
				title='Từ chối đơn đăng ký'
				visible={isRejectionModalVisible}
				onOk={handleRejectConfirm}
				onCancel={() => {
					setIsRejectionModalVisible(false);
					setRejectionReason('');
				}}
				okText='Từ chối'
				okType='danger'
				cancelText='Hủy'
			>
				<p>Bạn có chắc chắn muốn từ chối {selectedRowKeys.length} đơn đăng ký?</p>
				<Form layout='vertical'>
					<Form.Item
						label='Lý do từ chối'
						required
						rules={[{ required: true, message: 'Vui lòng nhập lý do từ chối' }]}
					>
						<Input.TextArea
							rows={3}
							placeholder='Nhập lý do từ chối'
							value={rejectionReason}
							onChange={(e) => setRejectionReason(e.target.value)}
						/>
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default QuanLyDonDangKyThanhVien;
