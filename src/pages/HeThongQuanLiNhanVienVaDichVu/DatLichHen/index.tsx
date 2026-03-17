import React, { useState, useMemo } from 'react';
import { Form, Button, Card, Select, Row, Col, Space, Table, message, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import useAppointmentSystem from '@/models/quanlylichhen';

const DatLichHen: React.FC = () => {
	const { dichVu, nhanVien, themLichHen, layGioTrong, kiemTraXungDot } = useAppointmentSystem();
	const [form] = Form.useForm();
	const [selectedService, setSelectedService] = useState<string>('');
	const [selectedEmployee, setSelectedEmployee] = useState<string>('');
	const [selectedDate, setSelectedDate] = useState<string>('');
	const [selectedTime, setSelectedTime] = useState<string>('');

	const serviceInfo = useMemo(() => {
		return dichVu.find((s) => s.id === selectedService);
	}, [selectedService, dichVu]);

	const employeesByService = useMemo(() => {
		return nhanVien.filter((e) => (e.dichVu || []).includes(selectedService) && e.dangHoatDong);
	}, [selectedService, nhanVien]);

	const availableTimeSlots = useMemo(() => {
		if (!selectedEmployee || !selectedDate) return [];
		return layGioTrong(selectedEmployee, selectedDate, serviceInfo?.khoangThoiGian || 0);
	}, [selectedEmployee, selectedDate, serviceInfo, layGioTrong]);

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();

			if (!selectedService || !selectedEmployee || !selectedDate || !selectedTime) {
				message.error('Vui lòng chọn đầy đủ thông tin');
				return;
			}

			const hasConflict = kiemTraXungDot(
				selectedEmployee,
				selectedDate,
				selectedTime,
				serviceInfo?.khoangThoiGian || 0,
			);

			if (hasConflict) {
				message.error('Thời gian này đã có lịch hẹn khác');
				return;
			}

			const success = themLichHen({
				tenKhachHang: values.tenKhachHang,
				emailKhachHang: values.emailKhachHang,
				dienThoaiKhachHang: values.dienThoaiKhachHang,
				idKhachHang: values.idKhachHang,
				idDichVu: selectedService,
				idNhanVien: selectedEmployee,
				ngayLichHen: selectedDate,
				gioLichHen: selectedTime,
				khoangThoiGian: serviceInfo?.khoangThoiGian || 0,
				ghiChu: values.ghiChu,
				trangThai: 'cho_xu_ly',
			});

			if (success) {
				message.success('Đặt lịch hẹn thành công');
				setSelectedDate('');
				setSelectedTime('');
			} else {
				message.error('Đặt lịch hẹn thất bại');
			}
		} catch (error) {
			message.error('Vui lòng kiểm tra dữ liệu');
		}
	};

	return (
		<div style={{ padding: '20px' }}>
			<Card title='Đặt lịch hẹn'>
				<Form form={form} layout='vertical'>
					<Row gutter={16}>
						<Col xs={24} md={12}>
							<Form.Item label='Dịch vụ' required>
								<Select
									placeholder='Chọn dịch vụ'
									value={selectedService || undefined}
									onChange={setSelectedService}
									options={dichVu.map((s) => ({ value: s.id, label: s.ten }))}
								/>
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item label='Nhân viên' required>
								<Select
									placeholder='Chọn nhân viên'
									value={selectedEmployee || undefined}
									onChange={setSelectedEmployee}
									disabled={!selectedService}
									options={employeesByService.map((e) => ({ value: e.id, label: e.ten }))}
								/>
							</Form.Item>
						</Col>
					</Row>

					{serviceInfo && (
						<Card
							size='small'
							style={{ marginBottom: 16, backgroundColor: '#f5f5f5' }}
							title={`Thông tin dịch vụ: ${serviceInfo.ten}`}
						>
							<p>
								<strong>Giá:</strong> {new Intl.NumberFormat('vi-VN').format(serviceInfo.gia)} ₫
							</p>
							<p>
								<strong>Thời gian:</strong> {serviceInfo.khoangThoiGian} phút
							</p>
							<p>
								<strong>Mô tả:</strong> {serviceInfo.moTa}
							</p>
						</Card>
					)}

					<Row gutter={16}>
						<Col xs={24} md={12}>
							<Form.Item label='Ngày' required>
								<Select
									placeholder='Chọn ngày'
									value={selectedDate || undefined}
									onChange={setSelectedDate}
									options={Array.from({ length: 30 }, (_, i) => {
										const date = moment().add(i, 'days');
										return {
											value: date.format('YYYY-MM-DD'),
											label: date.format('DD/MM/YYYY'),
										};
									})}
								/>
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item label='Giờ' required>
								<Select
									placeholder='Chọn giờ'
									value={selectedTime || undefined}
									onChange={setSelectedTime}
									disabled={availableTimeSlots.length === 0}
									options={availableTimeSlots.map((time) => ({ value: time, label: time }))}
								/>
							</Form.Item>
						</Col>
					</Row>

					<Form.Item
						label='Tên khách hàng'
						name='tenKhachHang'
						rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						label='Email'
						name='emailKhachHang'
						rules={[
							{ required: true, message: 'Vui lòng nhập email' },
							{ type: 'email', message: 'Email không hợp lệ' },
						]}
					>
						<Input type='email' />
					</Form.Item>

					<Form.Item
						label='Điện thoại'
						name='dienThoaiKhachHang'
						rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
					>
						<Input />
					</Form.Item>

					<Form.Item label='Mã khách hàng' name='idKhachHang'>
						<Input />
					</Form.Item>

					<Form.Item label='Ghi chú' name='ghiChu'>
						<Input.TextArea rows={3} />
					</Form.Item>

					<Form.Item>
						<Button type='primary' icon={<PlusOutlined />} onClick={handleSubmit} block>
							Đặt lịch hẹn
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</div>
	);
};

export default DatLichHen;
