import useSWR from "swr";

async function fechtAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <DatabaseStatus />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fechtAPI, {
    refreshInterval: 2000,
  });
  let databaseInfo = "Carregando...";
  if (!isLoading && data) {
    databaseInfo = new Date(data.updated_at).toLocaleString("pt-BR");
  }
  return <div>Última atualização: {databaseInfo}</div>;
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fechtAPI, {
    refreshInterval: 2000,
  });
  let databaseInfo = "Carregando...";
  if (!isLoading && data) {
    databaseInfo = (
      <>
        <h1>Database</h1>
        <div>Versão do banco: {data.dependencies.database.version}</div>
        <div>
          Conexões abertas: {data.dependencies.database.openned_connections}
        </div>
        <div>
          Maximo de conexão: {data.dependencies.database.max_connections}
        </div>
      </>
    );
  }
  return databaseInfo;
}
