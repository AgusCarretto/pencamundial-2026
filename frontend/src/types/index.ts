export interface User {
    id: number;
    userName: string;
    totalPoints: number;
}

export interface Match {
    id: number;
    homeTeam: string;
    awayTeam: string;
    homeScore?: number;
    awayScore?: number;
    groupName: string;
    matchDate: string;
    status: 'Pending' | 'InProgress' | 'Finished';
}

export interface Prediction {
    id: number;
    matchId: number;
    predictedHomeScore: number;
    predictedAwayScore: number;
    pointsEarned: number;
}

export interface UserRanking {
    userName: string;
    totalPoints: number;
}