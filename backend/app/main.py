import re

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import get_settings
from app.database import engine
from app import models
from app.api import auth, products, calculators, comparisons, illustrations, clients

# Tables created via Supabase SQL scripts - skip create_all to avoid conflicts
# models.Base.metadata.create_all(bind=engine)

settings = get_settings()
app = FastAPI(title="Annuities Analysis API", version="1.0.0")

origins_list = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]
vercel_regex = re.compile(r"^https://.*\.vercel\.app$")


def _is_allowed_origin(origin: str) -> bool:
    if origin in origins_list:
        return True
    if vercel_regex.fullmatch(origin):
        return True
    return False


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Ensure 500 responses include CORS headers so the browser shows the real error."""
    origin = request.headers.get("origin", "")
    headers = {}
    if origin and _is_allowed_origin(origin):
        headers["Access-Control-Allow-Origin"] = origin
        headers["Access-Control-Allow-Credentials"] = "true"
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
        headers=headers,
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins_list,
    allow_origin_regex=r"https://.*\.vercel\.app",  # Allow any Vercel deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(calculators.router, prefix="/api/calculator", tags=["calculators"])
app.include_router(comparisons.router, prefix="/api/comparison", tags=["comparisons"])
app.include_router(illustrations.router, prefix="/api/illustration", tags=["illustrations"])
app.include_router(clients.router, prefix="/api/clients", tags=["clients"])


@app.get("/")
def root():
    return {"message": "Annuities Analysis API", "docs": "/docs"}
