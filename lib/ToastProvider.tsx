import React, { createContext, useContext } from 'react'
import { View } from 'react-native'
import Toast from 'react-native-toast-message'

type ToastContextType = {
  show: (message: string, type?: 'success' | 'error' | 'info') => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const show = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    try {
      Toast.show({ text1: message, type })
    } catch (err) {
      console.error('Toast show error:', err)
      console.log(`[toast:${type}]`, message)
    }
  }

  return (
    <ToastContext.Provider value={{ show }}>
      <View style={{ flex: 1 }}>
        {children}
        <Toast />
      </View>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export default ToastProvider
