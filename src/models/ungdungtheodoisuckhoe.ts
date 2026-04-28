import { useCallback, useEffect, useState } from 'react';

export namespace UngDungTheoDoiSucKhoe {
	export interface Workout {
		id: string;
		ngay: string;
		loai: 'Cardio' | 'Strength' | 'Yoga' | 'HIIT' | 'Other';
		thoiLuong: number;
		caloDot: number;
		ghiChu: string;
		trangThai: 'Completed' | 'Missed';
	}

	export interface HealthMetric {
		id: string;
		ngay: string;
		canNang: number;
		height: number;
		bmi: number;
		restingHR: number;
		sleepHours: number;
	}

	export interface Goal {
		id: string;
		tenMucTieu: string;
		loai: 'Giảm cân' | 'Tăng cơ' | 'Cải thiện sức bền' | 'Khác';
		giaTriMucTieu: number;
		giaTriHienTai: number;
		hanChot: string;
		trangThai: 'Đang thực hiện' | 'Đã đạt' | 'Đã hủy';
	}

	export interface Exercise {
		id: string;
		tenBaiTap: string;
		nhomCo: 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Full Body';
		mucDo: 'Dễ' | 'Trung bình' | 'Khó';
		moTa: string;
		huongDan: string;
		caloTrungBinhMotGio: number;
	}
}

const STORAGE_KEYS = {
	WORKOUTS: 'fitness_workouts',
	HEALTH_METRICS: 'fitness_health_metrics',
	GOALS: 'fitness_goals',
	EXERCISES: 'fitness_exercises',
} as const;

const generateId = (): string => {
	return Date.now().toString();
};

const useUngDungTheoDoiSucKhoe = () => {
	const [workouts, setWorkouts] = useState<UngDungTheoDoiSucKhoe.Workout[]>([]);
	const [healthMetrics, setHealthMetrics] = useState<UngDungTheoDoiSucKhoe.HealthMetric[]>([]);
	const [goals, setGoals] = useState<UngDungTheoDoiSucKhoe.Goal[]>([]);
	const [exercises, setExercises] = useState<UngDungTheoDoiSucKhoe.Exercise[]>([]);

	useEffect(() => {
		const workoutsData = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
		const healthMetricsData = localStorage.getItem(STORAGE_KEYS.HEALTH_METRICS);
		const goalsData = localStorage.getItem(STORAGE_KEYS.GOALS);
		const exercisesData = localStorage.getItem(STORAGE_KEYS.EXERCISES);

		if (workoutsData) {
			setWorkouts(JSON.parse(workoutsData));
		}
		if (healthMetricsData) {
			setHealthMetrics(JSON.parse(healthMetricsData));
		}
		if (goalsData) {
			setGoals(JSON.parse(goalsData));
		}
		if (exercisesData) {
			setExercises(JSON.parse(exercisesData));
		}
	}, []);

	useEffect(() => {
		localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
	}, [workouts]);

	useEffect(() => {
		localStorage.setItem(STORAGE_KEYS.HEALTH_METRICS, JSON.stringify(healthMetrics));
	}, [healthMetrics]);

	useEffect(() => {
		localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
	}, [goals]);

	useEffect(() => {
		localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(exercises));
	}, [exercises]);

	const addWorkout = useCallback((data: Omit<UngDungTheoDoiSucKhoe.Workout, 'id'>): boolean => {
		try {
			const newWorkout: UngDungTheoDoiSucKhoe.Workout = {
				...data,
				id: generateId(),
			};
			setWorkouts((prev) => [...prev, newWorkout]);
			return true;
		} catch (error) {
			console.error('Error adding workout:', error);
			return false;
		}
	}, []);

	const updateWorkout = useCallback((id: string, data: Partial<Omit<UngDungTheoDoiSucKhoe.Workout, 'id'>>): boolean => {
		try {
			setWorkouts((prev) => prev.map((w) => (w.id === id ? { ...w, ...data } : w)));
			return true;
		} catch (error) {
			console.error('Error updating workout:', error);
			return false;
		}
	}, []);

	const deleteWorkout = useCallback((id: string): boolean => {
		try {
			setWorkouts((prev) => prev.filter((w) => w.id !== id));
			return true;
		} catch (error) {
			console.error('Error deleting workout:', error);
			return false;
		}
	}, []);

	const getWorkoutById = useCallback(
		(id: string) => {
			return workouts.find((w) => w.id === id);
		},
		[workouts],
	);

	const addHealthMetric = useCallback((data: Omit<UngDungTheoDoiSucKhoe.HealthMetric, 'id' | 'bmi'>): boolean => {
		try {
			const heightM = data.height / 100;
			const bmi = data.canNang / (heightM * heightM);
			const newMetric: UngDungTheoDoiSucKhoe.HealthMetric = {
				...data,
				id: generateId(),
				bmi: Math.round(bmi * 10) / 10,
			};
			setHealthMetrics((prev) => [...prev, newMetric]);
			return true;
		} catch (error) {
			console.error('Error adding health metric:', error);
			return false;
		}
	}, []);

	const updateHealthMetric = useCallback(
		(id: string, data: Partial<Omit<UngDungTheoDoiSucKhoe.HealthMetric, 'id' | 'bmi'>>): boolean => {
			try {
				setHealthMetrics((prev) =>
					prev.map((m) => {
						if (m.id === id) {
							const updated = { ...m, ...data };
							const heightM = updated.height / 100;
							updated.bmi = Math.round((updated.canNang / (heightM * heightM)) * 10) / 10;
							return updated;
						}
						return m;
					}),
				);
				return true;
			} catch (error) {
				console.error('Error updating health metric:', error);
				return false;
			}
		},
		[],
	);

	const deleteHealthMetric = useCallback((id: string): boolean => {
		try {
			setHealthMetrics((prev) => prev.filter((m) => m.id !== id));
			return true;
		} catch (error) {
			console.error('Error deleting health metric:', error);
			return false;
		}
	}, []);

	const getHealthMetricById = useCallback(
		(id: string) => {
			return healthMetrics.find((m) => m.id === id);
		},
		[healthMetrics],
	);

	const addGoal = useCallback((data: Omit<UngDungTheoDoiSucKhoe.Goal, 'id'>): boolean => {
		try {
			const newGoal: UngDungTheoDoiSucKhoe.Goal = {
				...data,
				id: generateId(),
			};
			setGoals((prev) => [...prev, newGoal]);
			return true;
		} catch (error) {
			console.error('Error adding goal:', error);
			return false;
		}
	}, []);

	const updateGoal = useCallback((id: string, data: Partial<Omit<UngDungTheoDoiSucKhoe.Goal, 'id'>>): boolean => {
		try {
			setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...data } : g)));
			return true;
		} catch (error) {
			console.error('Error updating goal:', error);
			return false;
		}
	}, []);

	const deleteGoal = useCallback((id: string): boolean => {
		try {
			setGoals((prev) => prev.filter((g) => g.id !== id));
			return true;
		} catch (error) {
			console.error('Error deleting goal:', error);
			return false;
		}
	}, []);

	const getGoalById = useCallback(
		(id: string) => {
			return goals.find((g) => g.id === id);
		},
		[goals],
	);

	const addExercise = useCallback((data: Omit<UngDungTheoDoiSucKhoe.Exercise, 'id'>): boolean => {
		try {
			const newExercise: UngDungTheoDoiSucKhoe.Exercise = {
				...data,
				id: generateId(),
			};
			setExercises((prev) => [...prev, newExercise]);
			return true;
		} catch (error) {
			console.error('Error adding exercise:', error);
			return false;
		}
	}, []);

	const updateExercise = useCallback(
		(id: string, data: Partial<Omit<UngDungTheoDoiSucKhoe.Exercise, 'id'>>): boolean => {
			try {
				setExercises((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)));
				return true;
			} catch (error) {
				console.error('Error updating exercise:', error);
				return false;
			}
		},
		[],
	);

	const deleteExercise = useCallback((id: string): boolean => {
		try {
			setExercises((prev) => prev.filter((e) => e.id !== id));
			return true;
		} catch (error) {
			console.error('Error deleting exercise:', error);
			return false;
		}
	}, []);

	const getExerciseById = useCallback(
		(id: string) => {
			return exercises.find((e) => e.id === id);
		},
		[exercises],
	);

	return {
		workouts,
		healthMetrics,
		goals,
		exercises,

		addWorkout,
		updateWorkout,
		deleteWorkout,
		getWorkoutById,

		addHealthMetric,
		updateHealthMetric,
		deleteHealthMetric,
		getHealthMetricById,

		addGoal,
		updateGoal,
		deleteGoal,
		getGoalById,

		addExercise,
		updateExercise,
		deleteExercise,
		getExerciseById,

		danhSachBuoiTap: workouts,
		themBuoiTap: addWorkout,
		capNhatBuoiTap: updateWorkout,
		xoaBuoiTap: deleteWorkout,
		layBuoiTapTheoId: getWorkoutById,

		danhSachChiSoSucKhoe: healthMetrics,
		themChiSoSucKhoe: addHealthMetric,
		capNhatChiSoSucKhoe: updateHealthMetric,
		xoaChiSoSucKhoe: deleteHealthMetric,
		layChiSoSucKhoeTheoId: getHealthMetricById,

		danhSachMucTieu: goals,
		themMucTieu: addGoal,
		capNhatMucTieu: updateGoal,
		xoaMucTieu: deleteGoal,
		layMucTieuTheoId: getGoalById,

		danhSachBaiTap: exercises,
		themBaiTap: addExercise,
		capNhatBaiTap: updateExercise,
		xoaBaiTap: deleteExercise,
		layBaiTapTheoId: getExerciseById,
	};
};

export type Workout = UngDungTheoDoiSucKhoe.Workout;
export type HealthMetric = UngDungTheoDoiSucKhoe.HealthMetric;
export type Goal = UngDungTheoDoiSucKhoe.Goal;
export type Exercise = UngDungTheoDoiSucKhoe.Exercise;

export { generateId };

export const loadWorkouts = (): Workout[] => {
	const data = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
	return data ? JSON.parse(data) : [];
};

export const saveWorkouts = (workouts: Workout[]): void => {
	localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
};

export const loadHealthMetrics = (): HealthMetric[] => {
	const data = localStorage.getItem(STORAGE_KEYS.HEALTH_METRICS);
	return data ? JSON.parse(data) : [];
};

export const saveHealthMetrics = (healthMetrics: HealthMetric[]): void => {
	localStorage.setItem(STORAGE_KEYS.HEALTH_METRICS, JSON.stringify(healthMetrics));
};

export const loadGoals = (): Goal[] => {
	const data = localStorage.getItem(STORAGE_KEYS.GOALS);
	return data ? JSON.parse(data) : [];
};

export const saveGoals = (goals: Goal[]): void => {
	localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
};

export const loadExercises = (): Exercise[] => {
	const data = localStorage.getItem(STORAGE_KEYS.EXERCISES);
	return data ? JSON.parse(data) : [];
};

export const saveExercises = (exercises: Exercise[]): void => {
	localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(exercises));
};

export default useUngDungTheoDoiSucKhoe;
