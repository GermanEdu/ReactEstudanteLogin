import React, { useState, useEffect } from "react";
import { useTable } from "react-table";
import './styles.css';
import logoCadastro from '../../assets/loginEstud.png';
import { Link, useNavigate } from 'react-router-dom';
import { FiXCircle, FiEdit, FiUserX } from "react-icons/fi";
import apiEstudante from "../../services/api";
import { formatDateToPtBr } from "../../utils/dateUtils";

const columns = (editAluno) => [
    {
        Header: 'Nome',
        accessor: 'nome',
    },
    {
        Header: 'Idade',
        accessor: 'idade',
    },
    {
        Header: 'Série',
        accessor: 'serie',
    },
    {
        Header: 'Nota Media',
        accessor: 'notaMedia',
    },
    {
        Header: 'Nome Pai',
        accessor: 'nomePai',
    },
    {
        Header: 'Nome Mae',
        accessor: 'nomeMae',
    },
    {
        Header: 'Dt.Nasc',
        accessor: 'dataNascimento',
        Cell: ({ value }) => formatDateToPtBr(value),
    },
    {
        Header: 'Ações',
        Cell: ({ row }) => (
            <div className="action-buttons">
                <button type="button" onClick={() => editAluno(row.original.id)}>
                    <FiEdit size="25" color="#17202a"/>
                </button>
                <button type="button">
                    <FiUserX size="25" color="#17202a"/>
                </button>
            </div>
        ),
    },
];

function Table({ columns, data }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data });

    return (
        <table {...getTableProps()} className="student-table">
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => (
                                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

export default function Estudantes() {
    const [nome, setNome] = useState('');
    const [estudantes, setEstudantes] = useState([]);

    const email = localStorage.getItem('email');  
    const token = localStorage.getItem('token');  

    const navigate = useNavigate();

    const authorization = {
        headers: {
            Authorization: `Bearer ${token}` // Adiciona espaço após Bearer
        }
    };
    
    useEffect(() => {
        apiEstudante.get('api/estudantes', authorization)
            .then(response => {
                setEstudantes(response.data);
            })
            .catch(error => {
                console.error("Erro ao buscar estudantes", error);
            });
    }, [token]);

    async function logout(){
        try {
            localStorage.clear();
            localStorage.setItem('token', '');
            authorization.headers = ''; 
            navigate('/');
        } catch (error) {
            alert('Não foi possivel fazer o logout: ' + error);
        }
    }

    async function editAluno(id){
        try {
            navigate(`estudante/novo/${id}`);
        } catch (error) {
            alert('Não foi possível editar: ' + error);
        }
    }

    return (
        <div className="estudante-container">
            <header>
                <img src={logoCadastro} alt="Cadastro" />
                <span>Bem-Vindo, <strong>{email}</strong>!</span>
                <Link className="button" to="estudante/novo/0">Novo Estudante</Link>
                <button onClick={logout} type="button">
                    <FiXCircle size={35} color="#17202a" />
                </button>
            </header>
            <form>
                <input 
                    type='text' 
                    placeholder="Filtrar por Nome" 
                    value={nome} 
                    onChange={e => setNome(e.target.value)} 
                />
            </form>
            <h1>Lista dos estudantes cadastrados</h1>
            <Table columns={columns(editAluno)} data={estudantes} />
        </div>
    );
}
