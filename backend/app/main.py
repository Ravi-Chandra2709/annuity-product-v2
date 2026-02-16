from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.database import engine
from app import models
from app.api import auth, products, calculators, comparisons, illustrations, clients

# Tables created via Supabase SQL scripts - skip create_all to avoid conflicts
# models.Base.metadata.create_all(bind=engine)

settings = get_settings()
app = FastAPI(title="Annuities Analysis API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()],
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
