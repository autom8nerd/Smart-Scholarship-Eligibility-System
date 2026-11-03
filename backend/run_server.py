#!/usr/bin/env python
"""
FastAPI Server Startup Script

Launches the Ancil AI FastAPI server in production mode
(without auto-reloading).
"""
import uvicorn
import sys

if __name__ == "__main__":
    print("=" * 70)
    print("Starting Ancil AI — Smart Enrollment & Scholarship Decision Support System")
    print("=" * 70)
    print("Interactive Documentation (Swagger): http://localhost:8000/docs")
    print("Alternative Documentation (ReDoc):   http://localhost:8000/redoc")
    print("=" * 70)
    print()
    
    try:
        # Launch uvicorn server in production mode
        uvicorn.run(
            "application:application",
            host="0.0.0.0",
            port=8000,
            reload=False,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n\nServer shutdown requested by user...")
        sys.exit(0)
    except Exception as e:
        print(f"\nServer startup encountered an error: {e}")
        sys.exit(1)
