import React, { useState, useEffect } from "react";
import './styles.css';
import { FiCornerDownLeft, FiUserPlus } from "react-icons/fi";
import { Link, useNavigate, useParams } from 'react-router-dom';
import apiEstudante from "../../services/api";

export default function NovoEstudante() {
    const [id, setId] = useState(null);
    const [nome, setNome] = useState('');
    const [idade, setIdade] = useState('');
    const [serie, setSerie] = useState('');
    const [notaMedia, setNotaMedia] = useState('');
    const [endereco, setEndereco] = useState('');
    const [nomePai, setNomePai] = useState('');
    const [nomeMae, setNomeMae] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');

    const { estudanteid } = useParams();
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const authorization = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    useEffect(() => {
        if (estudanteid === '0') return;
        loadAluno();
    }, [estudanteid]);

    async function loadAluno() {
        try {
            const response = await apiEstudante.get(`api/estudantes/${estudanteid}`, authorization);
            setId(response.data.id);
            setNome(response.data.nome);
            setIdade(response.data.idade.toString()); // Converte para string para o input
            setSerie(response.data.serie.toString()); // Converte para string para o input
            setNotaMedia(response.data.notaMedia.toString()); // Converte para string para o input
            setEndereco(response.data.endereco);
            setNomePai(response.data.nomePai);
            setNomeMae(response.data.nomeMae);
            setDataNascimento(response.data.dataNascimento.split('T')[0]); // Converte para formato yyyy-mm-dd
        } catch (error) {
            alert('Erro ao recuperar o estudante: ' + error.message);
            navigate('/estudantes');
        }
    }

    async function saveOrUpdate(event) {
        event.preventDefault();
        
        const data = {
            nome,
            idade: parseInt(idade, 10),
            serie: parseInt(serie, 10),
            notaMedia: parseFloat(notaMedia),
            endereco,
            nomePai,
            nomeMae,
            dataNascimento: new Date(dataNascimento)
        };

        try {
            if (estudanteid === '0') {
                await apiEstudante.post('api/estudantes', data, authorization);
            } else {
                data.id = id;
                await apiEstudante.put(`api/estudantes/${id}`, data, authorization);
            }
            navigate('/estudantes');
        } catch (error) {
            if (error.response && error.response.data) {
                alert('Erro ao gravar estudante: ' + JSON.stringify(error.response.data));
            } else {
                alert('Erro ao gravar estudante: ' + error.message);
            }
        }
    }

    return (
        <div className="novo-estudante-container">
            <div className="content">
                <section className="form-header">
                    <FiUserPlus size="105" color="#17202a" />
                    <h1>{estudanteid === '0' ? 'Incluir Novo Estudante' : 'Atualizar Estudante'}</h1>
                </section>
                <form onSubmit={saveOrUpdate} className="form-body">
                    <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
                    <input placeholder="Idade" value={idade} onChange={e => setIdade(e.target.value)} />
                    <input placeholder="Série" value={serie} onChange={e => setSerie(e.target.value)} />
                    <input placeholder="Nota Media" value={notaMedia} onChange={e => setNotaMedia(e.target.value)} />
                    <input placeholder="Endereco" value={endereco} onChange={e => setEndereco(e.target.value)} />
                    <input placeholder="Nome do Pai" value={nomePai} onChange={e => setNomePai(e.target.value)} />
                    <input placeholder="Nome da Mãe" value={nomeMae} onChange={e => setNomeMae(e.target.value)} />
                    <input type="date" placeholder="Data de Nascimento" value={dataNascimento} onChange={e => setDataNascimento(e.target.value)} />
                    <button className="button" type="submit">{estudanteid === '0' ? 'Incluir' : 'Atualizar'}</button>
                </form>
                <div>
                    <br />
                    <Link className="back-link" to="/estudantes">
                        <FiCornerDownLeft size="25" color="#17202a" />
                        Voltar
                    </Link>
                </div>
            </div>
        </div>
    );
}
