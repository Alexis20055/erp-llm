#!/bin/bash
# start-erp.sh — Arranca todo el ERP con IA (APIs cloud)
# Uso: ./start-erp.sh

echo "🚀 Arrancando ERP con IA..."

# 1. Cerrar Ollama si está abierto (usamos APIs cloud, no local)
OLLAMA_PID=$(ps aux | grep ollama | grep -v grep | awk '{print $2}')
if [ -n "$OLLAMA_PID" ]; then
  echo "🔒 Cerrando Ollama (PID $OLLAMA_PID)..."
  kill $OLLAMA_PID 2>/dev/null
  sleep 1
fi

# 2. Arrancar MongoDB con Docker
if ! curl -s http://localhost:27017 > /dev/null 2>&1; then
  echo "📦 Arrancando MongoDB (Docker)..."
  sudo docker start mongodb 2>/dev/null || \
  sudo docker run -d --name mongodb -p 27017:27017 mongo:7
  sleep 3
  echo "   MongoDB listo"
else
  echo "   MongoDB ya está corriendo"
fi

# 3. Arrancar backend (Express en puerto 5000)
echo "⚙️  Arrancando backend..."
cd ~/Documentos/UMA/Tercero/SIE/erp-llm/backend
npm run dev &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

# 4. Arrancar frontend (Vite en puerto 5173)
echo "🎨 Arrancando frontend..."
cd ~/Documentos/UMA/Tercero/SIE/erp-llm/frontend
npm run dev &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"

sleep 3

# 5. Poblar BD automáticamente
echo "🌱 Poblando BD con datos de prueba..."
for i in 1 2 3; do
  RESULT=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:5000/api/seed 2>/dev/null)
  if [ "$RESULT" = "201" ]; then
    echo "   BD poblada correctamente"
    break
  fi
  sleep 2
done
if [ "$RESULT" != "201" ]; then
  echo "   ⚠️ No se pudo poblar BD (backend no listo aún). Ejecuta luego: curl -X POST http://localhost:5000/api/seed"
fi

echo ""
echo "✅ ERP listo en http://localhost:5173"
echo ""
echo "Para ver logs LLM:   curl http://localhost:5000/api/llm/logs"
echo ""
echo "Presiona Ctrl+C para parar todo"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo '⏹️  Todo parado'" EXIT
wait
