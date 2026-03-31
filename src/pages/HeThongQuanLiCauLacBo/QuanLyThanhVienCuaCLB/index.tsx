import React, { useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, Select, message, Card, Popconfirm, Row, Col } from 'antd';
import { DeleteOutlined, SwapOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { QuanLyCauLacBo } from '@/models/quanlyclb';
import useQuanLyCauLacBo from '@/models/quanlyclb';

const QuanLyThanhVienCuaCLB: React.FC = () => {
	const { cauLacBo, thanhVien, thayDoiCLBThanhVien, xoaThanhVien } = useQuanLyCauLacBo();

	const [selectedCLBId, setSelectedCLBId] = useState<string | null>(null);
	const [isChangeClubModalVisible, setIsChangeClubModalVisible] = useState(false);
	const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
	const [newCLBId, setNewCLBId] = useState<string | null>(null);
	const [searchText, setSearchText] = useState('');
	const [filterStatus, setFilterStatus] = useState<string | null>(null);

	const handleSelectCLB = (clbId: string) => {
		setSelectedCLBId(clbId);
		setSelectedRowKeys([]);
	};

	const handleChangeClubSelected = () => {
		if (selectedRowKeys.length === 0) {
			message.warning('Vui lòng chọn ít nhất một thành viên');
			return;
		}
		setIsChangeClubModalVisible(true);
	};

	const handleChangeClubConfirm = async () => {
		if (!newCLBId) {
			message.warning('Vui lòng chọn câu lạc bộ mới');
			return;
		}

		const newCLB = cauLacBo.find((c) => c.id === newCLBId);
		const oldCLB = selectedCLBId ? cauLacBo.find((c) => c.id === selectedCLBId) : null;

		Modal.confirm({
			title: 'Xác nhận đổi câu lạc bộ',
			content: (
				<div>
					<p>Bạn sắp đổi CLB cho {selectedRowKeys.length} thành viên</p>
					<p>
						Từ: <strong>{oldCLB?.tenCLB || 'Tất cả'}</strong>
					</p>
					<p>
						Sang: <strong>{newCLB?.tenCLB}</strong>
					</p>
				</div>
			),
			okText: 'Xác nhận',
			cancelText: 'Hủy',
			onOk: () => {
				if (thayDoiCLBThanhVien(selectedRowKeys, newCLBId)) {
					message.success(`Đổi CLB cho ${selectedRowKeys.length} thành viên thành công`);
					setSelectedRowKeys([]);
					setIsChangeClubModalVisible(false);
					setNewCLBId(null);
				} else {
					message.error('Đổi CLB thất bại');
				}
			},
		});
	};

	const handleDeleteMember = (id: string) => {
		if (xoaThanhVien(id)) {
			message.success('Xóa thành viên thành công');
		} else {
			message.error('Xóa thành viên thất bại');
		}
	};

	let displayData: QuanLyCauLacBo.ThanhVienCauLacBo[] = [];

	if (selectedCLBId) {
		displayData = thanhVien.filter((tv) => tv.idCauLacBo === selectedCLBId);
	} else {
		displayData = thanhVien;
	}

	displayData = displayData.filter((tv) => {
		const matchSearch =
			tv.hoTen.toLowerCase().includes(searchText.toLowerCase()) ||
			tv.email.toLowerCase().includes(searchText.toLowerCase()) ||
			tv.soDienThoai.includes(searchText);
		const matchFilter = filterStatus === null || tv.trangThaiThanhVien === filterStatus;
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
		{
			title: 'Ngày duyệt',
			dataIndex: 'ngayDuyet',
			key: 'ngayDuyet',
			render: (text: number | undefined) => (text ? moment(text).format('DD/MM/YYYY') : 'N/A'),
			align: 'center' as const,
		},
		{
			title: 'Hành động',
			key: 'action',
			width: 120,
			render: (_: any, record: QuanLyCauLacBo.ThanhVienCauLacBo) => (
				<Space size='small'>
					<Popconfirm
						title='Xóa thành viên này?'
						okText='Có'
						cancelText='Không'
						onConfirm={() => handleDeleteMember(record.id)}
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
					<h2>Quản lý thành viên của câu lạc bộ</h2>
				</Col>
			</Row>

			<Row gutter={16} style={{ marginBottom: '16px' }}>
				<Col span={24}>
					<strong>Chọn câu lạc bộ:</strong>
				</Col>
			</Row>

			<Row gutter={16} style={{ marginBottom: '16px' }}>
				<Col span={24}>
					<Select
						placeholder='Chọn câu lạc bộ để xem thành viên (bỏ trống để xem tất cả)'
						allowClear
						value={selectedCLBId}
						onChange={(value) => handleSelectCLB(value)}
						style={{ width: '100%' }}
						options={[
							{
								label: `Tất cả (${thanhVien.length})`,
								value: '__all__',
								disabled: true,
							},
							...cauLacBo.map((clb) => ({
								label: `${clb.tenCLB} (${thanhVien.filter((tv) => tv.idCauLacBo === clb.id).length})`,
								value: clb.id,
							})),
						]}
					/>
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
							{ label: 'Hoạt động', value: 'active' },
							{ label: 'Không hoạt động', value: 'inactive' },
							{ label: 'Tạm dừng', value: 'suspended' },
						]}
					/>
				</Col>
			</Row>

			{selectedRowKeys.length > 0 && (
				<Row gutter={16} style={{ marginBottom: '16px' }}>
					<Col>
						<span>Đã chọn {selectedRowKeys.length} thành viên</span>
					</Col>
					<Col>
						<Button type='primary' icon={<SwapOutlined />} onClick={handleChangeClubSelected}>
							Đổi CLB cho {selectedRowKeys.length} thành viên
						</Button>
					</Col>
				</Row>
			)}

			<Table
				columns={columns as any}
				dataSource={displayData}
				rowKey='id'
				pagination={{ pageSize: 10 }}
				scroll={{ x: 1600 }}
				rowSelection={{
					selectedRowKeys,
					onChange: (keys) => setSelectedRowKeys(keys as string[]),
				}}
			/>

			{/* Modal đổi CLB */}
			<Modal
				title='Đổi câu lạc bộ'
				visible={isChangeClubModalVisible}
				onOk={handleChangeClubConfirm}
				onCancel={() => {
					setIsChangeClubModalVisible(false);
					setNewCLBId(null);
				}}
				okText='Xác nhận'
				cancelText='Hủy'
			>
				<Form layout='vertical'>
					<Form.Item
						label='Câu lạc bộ mới'
						required
						rules={[{ required: true, message: 'Vui lòng chọn câu lạc bộ mới' }]}
					>
						<Select
							placeholder='Chọn câu lạc bộ mới'
							value={newCLBId}
							onChange={(value) => setNewCLBId(value)}
							options={cauLacBo
								.filter((clb) => clb.id !== selectedCLBId)
								.map((clb) => ({
									label: clb.tenCLB,
									value: clb.id,
								}))}
						/>
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default QuanLyThanhVienCuaCLB;
