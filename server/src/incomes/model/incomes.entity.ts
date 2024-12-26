import { User } from 'src/users/models/users.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

@Entity({ name: 'incomes' })
export class Income {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.incomes, { onDelete: 'CASCADE' })
    // @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'uuid' })
    user_id: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 }) // Stores monetary amounts
    amount: number;

    @Column({ type: 'varchar', length: 50 })
    source: string; // E.g., Salary, Freelance, Gift

    @Column({ type: 'enum', enum: ['Monthly', 'Weekly', 'One-Time'] })
    frequency: 'Monthly' | 'Weekly' | 'One-Time';

    @Column({ type: 'timestamp' })
    date_received: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}
