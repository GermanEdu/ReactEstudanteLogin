import React, { useState, useEffect } from "react";
import { useTable, usePagination } from "react-table";
import './styles.css';
import logoCadastro from '../../assets/loginEstud.png';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiEdit, FiUserX } from "react-icons/fi";  // Importando o novo ícone
import apiEstudante from "../../services/api";
import { formatDateToPtBr } from "../../utils/dateUtils";
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const columns = (editAluno, showDeleteModal) => [
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
                <button type="button" onClick={() => showDeleteModal(row.original.id, row.original.nome)}>
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
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize }
    } = useTable({ columns, data }, usePagination);

    return (
        <>
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
                    {page.map(row => {
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
            <div className="pagination">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </button>
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </button>
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </button>
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                </button>
                <span>
                    Página{' '}
                    <strong>
                        {pageIndex + 1} de {pageOptions.length}
                    </strong>{' '}
                </span>
                <span>
                    | Ir para página:{' '}
                    <input
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0;
                            gotoPage(page);
                        }}
                        style={{ width: '100px' }}
                    />
                </span>
                <select
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value));
                    }}
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Mostrar {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </>
    );
}

export default function Estudantes() {
    const [nome, setNome] = useState('');
    const [estudantes, setEstudantes] = useState([]);
    const [filteredEstudantes, setFilteredEstudantes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState({ id: null, nome: '' });

    const email = localStorage.getItem('email');  
    const token = localStorage.getItem('token');  

    const navigate = useNavigate();

    const authorization = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    
    useEffect(() => {
        apiEstudante.get('api/estudantes', authorization)
            .then(response => {
                const sortedEstudantes = response.data.sort((a, b) => a.nome.localeCompare(b.nome));
                setEstudantes(sortedEstudantes);
                setFilteredEstudantes(sortedEstudantes);
            })
            .catch(error => {
                console.error("Erro ao buscar estudantes", error);
            });
    }, [token]);

    useEffect(() => {
        const filtered = estudantes.filter(estudante =>
            estudante.nome.toLowerCase().includes(nome.toLowerCase())
        );
        setFilteredEstudantes(filtered);
    }, [nome, estudantes]);

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

    function showDeleteModal(id, nome) {
        setSelectedStudent({ id, nome });
        setShowModal(true);
    }

    async function deleteAluno() {
        try {
            await apiEstudante.delete(`api/estudantes/${selectedStudent.id}`, authorization);
            setEstudantes(estudantes.filter(estudante => estudante.id !== selectedStudent.id));
            setFilteredEstudantes(filteredEstudantes.filter(estudante => estudante.id !== selectedStudent.id));
            setShowModal(false);
        } catch (error) {
            alert('Não foi possível excluir: ' + error.message);
            setShowModal(false);
        }
    }

    return (
        <div className="estudante-container">
            <header>
                <img src={logoCadastro} alt="Cadastro" />
                <span>Bem-Vindo, <strong>{email}</strong>!</span>
                <Link className="button" to="estudante/novo/0">Novo Estudante</Link>
                <button className="logout-button" onClick={logout} type="button">
                    <FiLogOut size={35} color="#17202a" />
                    <span className="tooltiptext">Logout</span>
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
            <div className="student-table-container">
                <Table columns={columns(editAluno, showDeleteModal)} data={filteredEstudantes} />
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Tem certeza que deseja excluir o estudante <strong>{selectedStudent.nome}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={deleteAluno}>
                        Excluir
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
