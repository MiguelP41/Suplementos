interface CartItem {
  name: string
  storeName: string
  price: number
  quantity: number
}

export function generateWhatsAppLink(
  items: CartItem[], 
  cityName: string, 
  paymentMethod: string = 'CASHEA_CUOTAS',
  phone: string = '584120000000' // Número de WhatsApp Central
): string {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  
  let itemDetails = ''
  items.forEach((item, index) => {
    itemDetails += `\n*Item ${index + 1}:* ${item.name}`
    itemDetails += `\n*Tienda:* ${item.storeName}`
    itemDetails += `\n*Precio:* $${item.price.toFixed(2)}\n`
  })

  const message = `¡Hola Central Fitness! 🏋️‍♂️ Quiero procesar mi orden generada por el Asesor:

*Ubicación:* ${cityName}
*Método de Pago:* ${paymentMethod}
----------------------------------${itemDetails}----------------------------------
*Monto Total Estimado:* $${total.toFixed(2)} USD

Quedo a la espera de los datos de pago para confirmar mi orden.`

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}