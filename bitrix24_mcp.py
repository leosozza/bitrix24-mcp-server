import os
import httpx
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("bitrix24-mcp")

@mcp.tool()
async def bitrix24_contar_leads(inicio: str, fim: str, scouter: str) -> dict:
    """Conta leads no Bitrix24 por período e scouter."""
    token = os.environ["BITRIX24_TOKEN"]
    portal = os.environ["BITRIX24_HOST"]
    url = f"https://{portal}/rest/crm.lead.list.json"
    data = {
        "filter[>=DATE_CREATE]": inicio,
        "filter[<=DATE_CREATE]": fim,
        # TODO: resolver o scouter para o ID correto
        "filter[ASSIGNED_BY_ID]": scouter,
    }
    headers = {"Authorization": f"Bearer {token}"}
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(url, data=data, headers=headers)
        resp.raise_for_status()
        leads = resp.json().get("result", [])
    return {"sucesso": True, "total": len(leads)}


if __name__ == "__main__":
    mcp.run()
