import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './Components/Login';
import VerifyOtp from './Components/VerifyOtp';
import Signup from './Components/Signup';
import ProtectedRoute from './Components/ProtectedRoute';
import JudgeHomePage from './Components/JudgeHomePage';
import LeaderHomePage from './Components/LeaderHomePage';
import LeaderTeamPage from './Components/LeaderTeamPage';
import AdminHomePage from './Components/AdminHomePage';
import ScoringPage from './Components/ScoringPage';
import LiveLeaderBoardPage from './Components/LiveLeaderBoardPage';
import ChartPage from './Components/ChartPage';
import SponsorshipDetail from './Components/SponsorshipDetail';
import JoinTeamPage from './Components/JoinTeamPage';
import CertificateDownload from './Components/Certificate';
import CreateTournament from './Components/CreateTournament.js';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/verify-otp" component={VerifyOtp} />
        <Route path="/register" component={Signup} />
        <Route path="/leaderboard" component={LiveLeaderBoardPage} />
        
        <ProtectedRoute path="/me/" component={ProtectedRoute} />
        <ProtectedRoute path="/home/Judge" component={JudgeHomePage} />
        <ProtectedRoute path="/home/judge/outdoor" component={ScoringPage} />
        <ProtectedRoute path="/home/judge/indoor" component={ScoringPage} />
        <ProtectedRoute path="/home/judge/fun" component={ScoringPage} />

        <ProtectedRoute exact path="/home/Leader" component={LeaderHomePage} />
        <Route path="/home/Leader/team/:teamName" component={JoinTeamPage} />
        <ProtectedRoute path="/home/Admin" component={AdminHomePage} />
        <ProtectedRoute path="/home/chart" component={ChartPage} />
        <ProtectedRoute path="/admin/sponsorship-details" component={SponsorshipDetail} />
        <ProtectedRoute path="/certificate" component={CertificateDownload} />
        <ProtectedRoute path="/create-tournament" component={CreateTournament} />
      </Switch>
    </Router>
  );
}

export default App;
