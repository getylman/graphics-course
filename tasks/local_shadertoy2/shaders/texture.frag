#version 430
#extension GL_GOOGLE_include_directive : require

layout(location = 0) out vec4 out_fragColor;


layout(push_constant) uniform params 
{
  uint resolution_x;
  uint resolution_y;
  float mouse_x;
  float mouse_y;
  float time;
} params_t;

vec2 iResolution;


const float PI2 = 6.283185;
const int MIN_DEPTH = 2;
const int MAX_DEPTH = 8;


vec2 rotate_vec2 (in vec2 v, in float r, in vec2 pivod)
{
    float rad = r * PI2;
    float s = sin(rad);
    float c = cos(rad);
    
    return vec2((v-pivod) * mat2(c, s, -s, c)) + pivod;
}

vec4 g2c(in vec2 p) 
{
    float d = dot(p, vec2(123.34547, 321.5643));
    vec4 f = vec4(4823.9471,5643.2356, 1045.3865, 8326.3953) / (d + 0.513254);
    vec4 s = fract(sin(f * 4572.8462));
    return s;
}

float noise(in vec2 uv, in float scale, in float disorder)
{
    vec2 g = uv * scale;
    vec2 g_id = floor(g); 
    vec2 g_uv = g - g_id;
    vec2 g_uv_inv = 1.0 - g_uv;
    
    vec3 cubx = vec3(g_uv.x, g_uv.x, g_uv_inv.x) * vec3(g_uv.x, g_uv_inv.x, g_uv_inv.x) * vec3(0.5, 1.0, 0.5) + vec3(0.0, 0.5, 0.0);
    vec3 cuby = vec3(g_uv.y, g_uv.y, g_uv_inv.y) * vec3(g_uv.y, g_uv_inv.y, g_uv_inv.y) * vec3(0.5, 1.0, 0.5) + vec3(0.0, 0.5, 0.0);
    
    mat3 cubm = mat3(cubx.x*cuby.x, cubx.x*cuby.y, cubx.x*cuby.z,
                    cubx.y*cuby.x, cubx.y*cuby.y, cubx.y*cuby.z, 
                    cubx.z*cuby.x, cubx.z*cuby.y, cubx.z*cuby.z);
    
    vec4 n4 = g2c(g_id-vec2(0.0, 0.0))* cubm[0][0] + g2c(g_id-vec2(1.0, 0.0))* cubm[1][0] + g2c(g_id-vec2(2.0, 0.0))* cubm[2][0] +
              g2c(g_id-vec2(0.0, 1.0))* cubm[0][1] + g2c(g_id-vec2(1.0, 1.0))* cubm[1][1] + g2c(g_id-vec2(2.0, 1.0))* cubm[2][1] +
              g2c(g_id-vec2(0.0, 2.0))* cubm[0][2] + g2c(g_id-vec2(1.0, 2.0))* cubm[1][2] + g2c(g_id-vec2(2.0, 2.0))* cubm[2][2];
   
    return 1.0 - sqrt(length(rotate_vec2(n4.xy, disorder, vec2(0.5, 0.5)) - n4.zw));
}

float fract_noise(vec2 uv, float disorder, int minDepth, int maxDepth){

    float fract_noise = 0.0;
    
    for( int i = minDepth; i < maxDepth; i++){
    
        float currentDepth2pow = pow(2.0, float(i - minDepth + 1));
        float fi = float(i);
        
        fract_noise += noise(uv, pow(2.0, fi), disorder * currentDepth2pow) * (1.0 / currentDepth2pow);
    }
    return fract_noise;
}

void main(void) {
    float t = params_t.time / 2.0;
    iResolution = vec2(params_t.resolution_x, params_t.resolution_y);
    vec2 uv = gl_FragCoord.xy / min(iResolution.x, iResolution.y);
    
    float fbm = fract_noise(uv, t, MIN_DEPTH, MAX_DEPTH);
    fbm = pow(fbm, 3.0);
    
    out_fragColor = vec4(vec3(fbm), 1.0) * vec4(3.0, 1.0, 0.5, 1.0);
}