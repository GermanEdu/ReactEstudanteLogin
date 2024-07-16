import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './pages/Login';
import Estudantes from "./pages/Estudantes";
import NovoEstudante from "./pages/NovoEstudante";

export default function AppRoutes() { // Renomeado para evitar conflito de nomes parecidos
    return (
       
        <Router>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/estudantes" element={<Estudantes />} />
            <Route path="/Estudantes/estudante/novo/:estudanteid" element={<NovoEstudante />} />
        </Routes>
    </Router>
    );
}
