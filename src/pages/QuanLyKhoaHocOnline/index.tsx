import React, { useState } from 'react';
import {
	Table,
	Button,
	Space,
	Tag,
	Modal,
	Form,
	Input,
	InputNumber,
	Select,
	message,
	Card,
	Popconfirm,
	Row,
	Col,
	Drawer,
	Divider,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import useQuanlykhoahoc from '@/models/quanlykhoahoc';

interface khoaHocOnline {
    id: string;
    tenKhoaHoc: string;
    moTa: string;
    giangVienId: string;
    soluongHocVien: number;
    trangThai: 'dang-mo' | 'da-ket-thuc' | 'tam-dung';
}

interface giangVien {
    id: string;
    ten: string;
}

const giangvien: giangVien[] = [
    { id: 'gv1', ten: 'Nguyễn Văn A' },
    { id: 'gv2', ten: 'Trần Thị B' },
    { id: 'gv3', ten: 'Lê Văn C' },
];

const QuanLyKhoaHocOnline: React.FC = () => {
    const [form] = Form.useForm();
    const { khoaHocOnlineList, setKhoaHocOnlineList } = useQuanlykhoahoc();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDetailDrawerVisible, setIsDetailDrawerVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<khoaHocOnline | null>(null);
    const [formKhoaHoc, setFormKhoaHoc] = useState<khoaHocOnline>({
        id: '',
        tenKhoaHoc: '',
        moTa: '',
        giangVienId: '',
        soluongHocVien: 0,
        trangThai: 'dang-mo',
    });
    const [isvisible, setIsVisible] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchKhoaHoc, setSearchKhoaHoc] = useState('');

    const filteredKhoaHoc = khoaHocOnlineList.filter(kh => {
        const keyword = searchKhoaHoc.trim().toLowerCase();
        const tenKhoaHoc = kh.tenKhoaHoc.toLowerCase();
        const giangVien = giangvien.find(gv => gv.id === kh.giangVienId)?.ten.toLowerCase() || '';
        return tenKhoaHoc.includes(keyword) || giangVien.includes(keyword);
    });

    const handleAddKhoaHoc = () => {
        setFormKhoaHoc({
            id: '',
            tenKhoaHoc: '',
            moTa: '',
            giangVienId: '',
            soluongHocVien: 0,
            trangThai: 'dang-mo',
        });
        setEditingId(null);
        setIsVisible(true);
    };

    const handleOpenModal = (record?: khoaHocOnline) => {
        if (record) {
            setEditingId(record.id);
            form.setFieldsValue(record);
        } else {
            setEditingId(null);
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setFormKhoaHoc(values);

            if (editingId) {
                const newList = khoaHocOnlineList.map(kh => kh.id === editingId ? { ...kh, ...values } : kh)
                    .sort((a, b) => b.soluongHocVien - a.soluongHocVien);
                setKhoaHocOnlineList(newList);
                message.success('Cập nhật khóa học thành công');
            } else {
                const newKhoaHoc = { ...values, id: `kh${Date.now()}` };
                const newList = [...khoaHocOnlineList, newKhoaHoc]
                    .sort((a, b) => b.soluongHocVien - a.soluongHocVien);
                setKhoaHocOnlineList(newList);
                message.success('Thêm khóa học thành công');
            }
            form.resetFields();
            setIsModalVisible(false);
        } catch (error) {
            message.error('Vui lòng kiểm tra lại thông tin');
        }
    };

     const handleDelete = (id: string) => {
          const khoaHoc = khoaHocOnlineList.find(kh => kh.id === id);
          if (!khoaHoc) {
              message.error('Khóa học không tồn tại');
              return;
          }
          if (khoaHoc.soluongHocVien > 0) {
              message.error('Không thể xóa khóa học đang có học viên đăng ký');
              return;
          }
          const newList = khoaHocOnlineList.filter(kh => kh.id !== id);
          setKhoaHocOnlineList(newList);
          message.success('Xóa khóa học thành công');
      };

     const handleViewDetail = (record: khoaHocOnline) => {
          setSelectedRecord(record);
          setIsDetailDrawerVisible(true);
      };

    const columns = [
        {
            title: 'Tên khóa học',
            dataIndex: 'tenKhoaHoc',
            key: 'tenKhoaHoc',
            align: 'center' as const,
        },
        {
            title: 'Giảng viên',
            dataIndex: 'giangVienId',
            key: 'giangVienId',
            render: (id: string) => giangvien.find(gv => gv.id === id)?.ten || 'N/A',
            align: 'center' as const,
        },
        {
            title: 'Số lượng học viên',
            dataIndex: 'soluongHocVien',
            key: 'soluongHocVien',
            align: 'center' as const,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trangThai',
            key: 'trangThai',
            render: (trangThai: string) => {
                const statusMap: Record<string, { color: string; label: string }> = {
                    'dang-mo': { color: 'green', label: 'Đang mở' },
                    'da-ket-thuc': { color: 'gray', label: 'Đã kết thúc' },
                    'tam-dung': { color: 'orange', label: 'Tạm dừng' },
                };
                return <Tag color={statusMap[trangThai]?.color}>{statusMap[trangThai]?.label}</Tag>;
            },
            align: 'center' as const,
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: khoaHocOnline) => (
                <Space size='middle'>
                    <Button type='text' icon={<EyeOutlined />} onClick={() => handleViewDetail(record)} title='Xem chi tiết' />
                    <Button type='text' icon={<EditOutlined />} onClick={() => handleOpenModal(record)} title='Chỉnh sửa' />
                    <Popconfirm title='Xóa khóa học' onConfirm={() => handleDelete(record.id)} okText='Có' cancelText='Không'>
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
					<h2>Quản lý Khóa Học Online</h2>
				</Col>
				<Col>
					<Button type='primary' icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
						Thêm khóa học
					</Button>
				</Col>
			</Row>

			<Row style={{ marginBottom: '16px' }}>
				<Col>
					<Input
						placeholder="Tìm kiếm khóa học hoặc giảng viên"
						value={searchKhoaHoc}
						onChange={(e) => setSearchKhoaHoc(e.target.value)}
						style={{ width: 300 }}
					/>
				</Col>
			</Row>

			<Table
				columns={columns as any}
				dataSource={filteredKhoaHoc}
				rowKey='id'
				pagination={{ pageSize: 10 }}
				scroll={{ x: 1200 }}
			/>

			<Modal
				title={editingId ? 'Chỉnh sửa khóa học' : 'Thêm khóa học online'}
				visible={isModalVisible}
				onOk={handleSubmit}
				onCancel={() => setIsModalVisible(false)}
				width={600}
			>
				<Form form={form} layout='vertical'>
					<Form.Item
						name='tenKhoaHoc'
						label='Tên Khóa Học'
						rules={[{ required: true, message: 'Vui lòng nhập tên khóa học' }]}
					>
						<Input placeholder='Nhập tên khóa học' />
					</Form.Item>

					<Form.Item
						name='moTa'
						label='Mô Tả'
						rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
					>
						<Input.TextArea placeholder='Nhập mô tả khóa học' rows={3} />
					</Form.Item>

					<Form.Item
						name='giangVienId'
						label='Giảng Viên'
						rules={[{ required: true, message: 'Vui lòng chọn giảng viên' }]}
					>
						<Select
							placeholder='Chọn giảng viên'
							options={giangvien.map((item) => ({
								label: item.ten,
								value: item.id,
							}))}
						/>
					</Form.Item>

					<Form.Item
						name='soluongHocVien'
						label='Số Lượng Học Viên'
						rules={[{ required: true, message: 'Vui lòng nhập số lượng học viên' }]}
					>
						<InputNumber min={0} style={{ width: '100%' }} />
					</Form.Item>

					<Form.Item
						name='trangThai'
						label='Trạng Thái'
						rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
					>
						<Select
							options={[
								{ label: 'Đang mở', value: 'dang-mo' },
								{ label: 'Đã kết thúc', value: 'da-ket-thuc' },
								{ label: 'Tạm dừng', value: 'tam-dung' },
							]}
						/>
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title='Chi tiết khóa học'
				visible={isDetailDrawerVisible}
				onCancel={() => setIsDetailDrawerVisible(false)}
				width={600}
				footer={[
					<Button key='close' onClick={() => setIsDetailDrawerVisible(false)}>
						Đóng
					</Button>,
				]}
			>
				{selectedRecord && (
					<div>
						<Row gutter={[16, 16]}>
							<Col span={24}>
								<p>
									<strong>Tên Khóa Học:</strong> {selectedRecord.tenKhoaHoc}
								</p>
							</Col>
							<Col span={24}>
								<p>
									<strong>Giảng Viên:</strong> {giangvien.find(gv => gv.id === selectedRecord.giangVienId)?.ten || 'N/A'}
								</p>
							</Col>
							<Col span={24}>
								<Divider />
							</Col>
							<Col span={24}>
								<strong>Mô Tả:</strong>
								<p>{selectedRecord.moTa}</p>
							</Col>
							<Col span={24}>
								<p>
									<strong>Số Lượng Học Viên:</strong> {selectedRecord.soluongHocVien}
								</p>
							</Col>
							<Col span={24}>
								<p>
									<strong>Trạng Thái:</strong>{' '}
									<Tag
										color={
											selectedRecord.trangThai === 'dang-mo'
												? 'green'
												: selectedRecord.trangThai === 'da-ket-thuc'
												? 'gray'
												: 'orange'
										}
									>
										{selectedRecord.trangThai === 'dang-mo'
											? 'Đang mở'
											: selectedRecord.trangThai === 'da-ket-thuc'
											? 'Đã kết thúc'
											: 'Tạm dừng'}
									</Tag>
								</p>
							</Col>
						</Row>
					</div>
				)}
			</Modal>

		</Card>
	);
};

export default QuanLyKhoaHocOnline;


   
